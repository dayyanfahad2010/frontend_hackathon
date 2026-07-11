import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Paperclip, DollarSign } from 'lucide-react';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Loader from '../../components/ui/Loader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { fetchIssueById, assignIssue, updateIssueStatus } from '../../redux/features/issues/issueThunk';
import { createMaintenance } from '../../redux/features/maintenance/maintenanceThunk';
import { useToast } from '../../components/ui/Toast';

const WORKFLOW = ['Reported', 'Assigned', 'Inspection Started', 'Maintenance In Progress', 'Waiting for Parts', 'Resolved', 'Closed'];

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { current: issue, loading, actionLoading } = useSelector((state) => state.issues);

  const [technician, setTechnician] = useState('');
  const [note, setNote] = useState('');
  const [parts, setParts] = useState('');
  const [cost, setCost] = useState('');
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  const [resolveError, setResolveError] = useState('');
  const [savingAssign, setSavingAssign] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchIssueById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (issue) {
      setTechnician(issue.technician?._id || issue.technician?.email || issue.technician || '');
    }
  }, [issue]);

  if (loading && !issue) return <Loader label="Loading issue..." />;
  if (!issue) return <p className="text-sm text-slate">Issue not found.</p>;

  const status = issue.status || 'Reported';
  const currentIdx = WORKFLOW.indexOf(status);
  const nextStatus = WORKFLOW[currentIdx + 1];

  const handleAssign = async () => {
    if (!technician.trim()) return;
    setSavingAssign(true);
    const action = await dispatch(assignIssue({ id: issue._id || issue.id || id, technicianId: technician }));
    setSavingAssign(false);
    if (assignIssue.fulfilled.match(action)) {
      toast(action.payload?.message || 'Technician assigned', 'success');
    } else {
      toast(action.payload?.message || 'Could not assign technician', 'error');
    }
  };

  const advanceStatus = async (targetStatus) => {
    const action = await dispatch(updateIssueStatus({ id: issue._id || issue.id || id, status: targetStatus }));
    if (updateIssueStatus.fulfilled.match(action)) {
      toast(action.payload?.message || `Issue marked as ${targetStatus}`, 'success');
    } else {
      toast(action.payload?.message || 'Could not update status', 'error');
    }
  };

  const handleAdvance = async () => {
    if (nextStatus === 'Resolved' && !note.trim()) {
      setResolveError('An issue cannot be resolved without a maintenance note.');
      return;
    }
    if (cost && Number(cost) < 0) {
      setResolveError('Maintenance cost cannot be negative.');
      return;
    }
    setResolveError('');
    if (nextStatus === 'Resolved') { setShowResolveConfirm(true); return; }
    await advanceStatus(nextStatus);
  };

  const confirmResolve = async () => {
    const maintenanceAction = await dispatch(createMaintenance({
      issueId: issue._id || issue.id || id,
      notes: note,
      partsReplaced: parts,
      cost: cost ? Number(cost) : undefined,
    }));

    if (!createMaintenance.fulfilled.match(maintenanceAction)) {
      toast(maintenanceAction.payload?.message || 'Could not save maintenance record', 'error');
      setShowResolveConfirm(false);
      return;
    }

    await advanceStatus('Resolved');
    setShowResolveConfirm(false);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <button onClick={() => navigate(-1)} className="text-sm text-slate hover:text-ink inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to issues
      </button>

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="code-frame">{issue._id || issue.id || id}</span>
            <Badge>{issue.priority}</Badge>
            <Badge>{status}</Badge>
          </div>
          <h1 className="font-display text-lg font-semibold text-ink mt-2">{issue.title}</h1>
          <p className="text-sm text-slate mt-1">
            {issue.asset?.name}
            {issue.asset?.code && (
              <> · <span className="text-primary-500 cursor-pointer hover:underline" onClick={() => navigate(`/admin/assets/${issue.asset.code}`)}>{issue.asset.code}</span></>
            )}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Reported complaint" />
            <p className="text-sm text-ink">{issue.description}</p>
            <p className="text-xs text-slate-light mt-2">Reported by {issue.reporter || issue.reporterName || 'Anonymous (public report)'}</p>

            {(issue.causes?.length || issue.checks?.length) && (
              <div className="mt-4 rounded-lg border border-primary-100 bg-primary-50/50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-xs font-medium text-primary-600">AI Issue Triage (reviewed by reporter)</span>
                </div>
                {issue.causes?.length > 0 && (
                  <p className="text-xs text-slate"><span className="text-slate-light">Possible causes: </span>{issue.causes.join(', ')}</p>
                )}
                {issue.checks?.length > 0 && (
                  <p className="text-xs text-slate mt-1"><span className="text-slate-light">Initial checks: </span>{issue.checks.join('; ')}</p>
                )}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Maintenance record" subtitle="Required before an issue can be resolved" />
            <div className="space-y-4">
              <TextArea label="Maintenance notes" required rows={3}
                placeholder="Inspection findings and work performed..."
                value={note} onChange={(e) => setNote(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Parts replaced" placeholder="e.g. HDMI cable" value={parts} onChange={(e) => setParts(e.target.value)} />
                <Input label="Cost" type="number" icon={DollarSign} placeholder="0.00" value={cost} onChange={(e) => setCost(e.target.value)} />
              </div>
              <div className="border border-dashed border-line rounded-lg p-4 text-center">
                <Paperclip className="w-4 h-4 text-slate-light mx-auto mb-1" />
                <p className="text-xs text-slate-light">Attach evidence (photo/video) — Cloudinary upload</p>
              </div>
              {resolveError && <p className="text-xs text-danger-500">{resolveError}</p>}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Assignment" />
            <div className="space-y-3">
              <Input
                label="Assigned technician (ID or email)"
                placeholder="technician@organization.com"
                value={technician} onChange={(e) => setTechnician(e.target.value)}
              />
              <Button fullWidth size="sm" variant="secondary" loading={savingAssign} onClick={handleAssign}>
                Save assignment
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Status workflow" />
            <div className="space-y-2 mb-4">
              {WORKFLOW.map((s, i) => (
                <div key={s} className={`flex items-center gap-2 text-sm ${i <= currentIdx ? 'text-ink' : 'text-slate-light'}`}>
                  <div className={`w-2 h-2 rounded-full ${i <= currentIdx ? 'bg-primary-500' : 'bg-line'}`} />
                  {s}
                </div>
              ))}
            </div>
            {nextStatus && (
              <Button fullWidth onClick={handleAdvance} loading={actionLoading}>
                Mark as {nextStatus}
              </Button>
            )}
            {status === 'Resolved' && (
              <Button fullWidth variant="secondary" className="mt-2" loading={actionLoading} onClick={() => advanceStatus('Reopened')}>
                Reopen issue
              </Button>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showResolveConfirm}
        onClose={() => setShowResolveConfirm(false)}
        onConfirm={confirmResolve}
        title="Resolve this issue?"
        message="The asset status will return to Operational and this action will be recorded in the permanent history."
        confirmLabel="Resolve issue"
        variant="primary"
        loading={actionLoading}
      />
    </div>
  );
}
