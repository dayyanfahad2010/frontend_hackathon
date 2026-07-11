import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import TextArea from '../../components/ui/TextArea';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { runAiTriage } from '../../redux/features/ai/aiThunk';
import { reportPublicIssue } from '../../redux/features/public/publicThunk';
import { useToast } from '../../components/ui/Toast';

export default function ReportIssueForm({ asset, onBack }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { triageResult, loading: aiLoading } = useSelector((state) => state.ai);
  const { submitting, reportedIssue } = useSelector((state) => state.public);

  const [complaint, setComplaint] = useState('');
  const [aiState, setAiState] = useState('idle');
  const [form, setForm] = useState({ title: '', category: '', priority: '', reporterName: '' });

  const runTriage = async () => {
    if (!complaint.trim()) return;
    setAiState('loading');
    const action = await dispatch(runAiTriage({ description: complaint, assetCode: asset.code }));
    if (runAiTriage.fulfilled.match(action)) {
      const result = action.payload?.data || action.payload;
      setForm((f) => ({
        ...f,
        title: result?.title || f.title,
        category: result?.category || f.category,
        priority: result?.priority || f.priority,
      }));
      setAiState('success');
    } else {
      setAiState('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = await dispatch(reportPublicIssue({
      assetCode: asset.code,
      data: {
        description: complaint,
        title: form.title,
        category: form.category,
        priority: form.priority,
        reporterName: form.reporterName,
      },
    }));

    if (reportPublicIssue.fulfilled.match(action)) {
      toast(action.payload?.message || 'Issue reported successfully', 'success');
    } else {
      toast(action.payload?.message || 'Could not submit issue. Please try again.', 'error');
    }
  };

  if (reportedIssue) {
    const issueId = reportedIssue._id || reportedIssue.id || reportedIssue.issueId;
    return (
      <Card className="text-center py-10">
        <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-5 h-5 text-success-500" />
        </div>
        <h2 className="font-display text-lg font-semibold text-ink mb-1">Issue reported</h2>
        <p className="text-sm text-slate mb-2">Your issue number</p>
        <span className="code-frame mb-4">{issueId}</span>
        <p className="text-sm text-slate">A technician will be assigned shortly. You can check status anytime using this issue number.</p>
        <Button variant="secondary" className="mt-6" onClick={onBack}>Back to asset page</Button>
      </Card>
    );
  }

  return (
    <div>
      <button onClick={onBack} className="text-sm text-slate hover:text-ink inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <Card>
        <h2 className="font-display text-lg font-semibold text-ink mb-1">Report an issue</h2>
        <p className="text-sm text-slate mb-5">for <span className="font-medium text-ink">{asset.name}</span> <span className="text-slate-light">({asset.code})</span></p>

        <TextArea
          label="Describe the problem" required rows={3}
          placeholder="e.g. The projector display is flickering and sometimes does not detect HDMI."
          value={complaint} onChange={(e) => setComplaint(e.target.value)}
          containerClassName="mb-3"
        />

        <Button
          variant="outline" icon={Sparkles} size="sm"
          onClick={runTriage} loading={aiLoading || aiState === 'loading'} disabled={!complaint.trim()}
        >
          {aiState === 'success' ? 'Re-run AI triage' : 'Suggest details with AI'}
        </Button>

        {aiState === 'error' && (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-600 text-sm rounded-lg px-3 py-2 mt-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            AI suggestion is unavailable right now. You can still fill the details manually below.
          </div>
        )}

        {aiState === 'success' && triageResult && (
          <div className="mt-4 rounded-lg border border-primary-100 bg-primary-50/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-600">AI suggestion — review before submitting</span>
            </div>
            <div className="space-y-2 text-sm">
              {triageResult.causes?.length > 0 && (
                <div><span className="text-slate-light">Possible causes: </span><span className="text-ink">{triageResult.causes.join(', ')}</span></div>
              )}
              {triageResult.checks?.length > 0 && (
                <div><span className="text-slate-light">Initial checks: </span><span className="text-ink">{triageResult.checks.join('; ')}</span></div>
              )}
            </div>
            <p className="text-xs text-slate-light mt-3">These fields have been filled in below — edit anything before submitting.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <Input
            label="Issue title" required placeholder="Short, clear title"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category" required
              options={[{ value: 'AV Equipment / Display', label: 'AV Equipment / Display' }, { value: 'Electrical', label: 'Electrical' }, { value: 'HVAC', label: 'HVAC' }, { value: 'Plumbing', label: 'Plumbing' }, { value: 'Other', label: 'Other' }]}
              value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <Select
              label="Priority" required
              options={[{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }, { value: 'Critical', label: 'Critical' }]}
              value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
            />
          </div>
          {form.priority && (
            <div className="-mt-2"><Badge>{form.priority}</Badge></div>
          )}
          <Input
            label="Your name (optional)" placeholder="So we can follow up with you"
            value={form.reporterName} onChange={(e) => setForm({ ...form, reporterName: e.target.value })}
          />

          <Button type="submit" fullWidth size="lg" loading={submitting}>Submit issue</Button>
        </form>
      </Card>
    </div>
  );
}
