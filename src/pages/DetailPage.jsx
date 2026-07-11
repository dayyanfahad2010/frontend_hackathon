import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, QrCode, Download, Copy, ExternalLink, MapPin,
  Calendar, Pencil, ClipboardList,
} from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import AssetFormModal from './admin/AssetFormModal';
import { fetchAssetById, deleteAsset } from '../redux/features/assets/assetThunk';
import { fetchAssetHistory } from '../redux/features/history/historyThunk';
import { fetchIssues } from '../redux/features/issues/issueThunk';
import { useToast } from '../components/ui/Toast';

const TABS = ['Overview', 'History', 'Issues'];

export default function DetailPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { current: asset, loading: assetLoading } = useSelector((state) => state.assets);
  const { items: history, loading: historyLoading } = useSelector((state) => state.history);
  const { items: allIssues } = useSelector((state) => state.issues);

  const [tab, setTab] = useState('Overview');
  const [editOpen, setEditOpen] = useState(false);
  const [retireOpen, setRetireOpen] = useState(false);
  const [retiring, setRetiring] = useState(false);

  useEffect(() => {
    if (code) {
      dispatch(fetchAssetById(code));
      dispatch(fetchAssetHistory(code));
      dispatch(fetchIssues({ assetCode: code }));
    }
  }, [dispatch, code]);

  const assetIssues = allIssues.filter(
    (i) => i.asset?.code === code || i.assetCode === code || i.asset === code
  );

  const handleRetire = async () => {
    setRetiring(true);
    const action = await dispatch(deleteAsset(asset?._id || asset?.id || code));
    setRetiring(false);
    setRetireOpen(false);
    if (deleteAsset.fulfilled.match(action)) {
      toast('Asset retired successfully', 'success');
      navigate('/admin/assets');
    } else {
      toast(action.payload?.message || 'Could not retire asset', 'error');
    }
  };

  if (assetLoading && !asset) {
    return <Loader label="Loading asset..." fullScreen={false} />;
  }

  if (!asset) {
    return (
      <EmptyState title="Asset not found" description="This asset code doesn't match any registered asset." />
    );
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <button onClick={() => navigate(-1)} className="text-sm text-slate hover:text-ink inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to assets
      </button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-semibold text-ink">{asset.name}</h1>
            <Badge>{asset.status || 'Operational'}</Badge>
          </div>
          <span className="code-frame mt-2">{code || asset.code}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Pencil} onClick={() => setEditOpen(true)}>Edit</Button>
          <Button variant="danger" onClick={() => setRetireOpen(true)}>Retire asset</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex gap-1 border-b border-line">
            {TABS.map((t) => (
              <button
                key={t} onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px
                  ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate hover:text-ink'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'Overview' && (
            <Card>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Field icon={MapPin} label="Location" value={asset.location} />
                <Field label="Category" value={asset.category} />
                <Field label="Condition" value={asset.condition || '—'} />
                <Field label="Assigned technician" value={asset.technician || '—'} />
                <Field icon={Calendar} label="Last service" value={asset.lastService || '—'} />
                <Field icon={Calendar} label="Next service" value={asset.nextService || '—'} />
              </div>
            </Card>
          )}

          {tab === 'History' && (
            <Card>
              <CardHeader title="Activity history" subtitle="Permanent, non-editable timeline" />
              {historyLoading ? (
                <Loader label="Loading history..." />
              ) : history.length === 0 ? (
                <EmptyState title="No history yet" description="Activity for this asset will appear here." />
              ) : (
                <div className="space-y-4">
                  {history.map((h, i) => (
                    <div key={h._id || h.id || i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5" />
                        {i < history.length - 1 && <div className="w-px flex-1 bg-line" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm text-ink">{h.action}</p>
                        <p className="text-xs text-slate-light mt-0.5">
                          {h.date || (h.createdAt && new Date(h.createdAt).toLocaleDateString())} · {h.actor}{h.issue && ` · ${h.issue}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {tab === 'Issues' && (
            <Card padding="p-0">
              <div className="p-5 border-b border-line">
                <CardHeader title="Linked issues" />
              </div>
              {assetIssues.length === 0 ? (
                <EmptyState icon={ClipboardList} title="No linked issues" description="Issues reported for this asset will appear here." />
              ) : (
                <div className="divide-y divide-line">
                  {assetIssues.map((iss) => (
                    <div key={iss._id || iss.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/admin/issues/${iss._id || iss.id}`)}>
                      <div>
                        <span className="code-frame text-xs py-1">{iss._id || iss.id}</span>
                        <p className="text-sm text-ink mt-1.5">{iss.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>{iss.priority}</Badge>
                        <Badge>{iss.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* QR panel */}
        <Card className="h-fit">
          <CardHeader title="QR & public access" />
          <div className="flex flex-col items-center bg-gray-50 rounded-lg p-6 mb-4">
            <div className="w-36 h-36 bg-white border border-line rounded-lg flex items-center justify-center">
              <QrCode className="w-24 h-24 text-ink" strokeWidth={1} />
            </div>
            <span className="code-frame text-xs mt-3">{code || asset.code}</span>
          </div>
          <div className="space-y-2">
            <Button variant="secondary" fullWidth icon={Download} size="sm">Download QR label</Button>
            <Button
              variant="secondary" fullWidth icon={Copy} size="sm"
              onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/asset/${code || asset.code}`); toast('Public link copied', 'success'); }}
            >
              Copy public link
            </Button>
            <Button
              variant="outline" fullWidth icon={ExternalLink} size="sm"
              onClick={() => navigate(`/asset/${code || asset.code}`)}
            >
              Open public asset page
            </Button>
          </div>
        </Card>
      </div>

      <AssetFormModal open={editOpen} onClose={() => setEditOpen(false)} asset={asset} />

      <ConfirmDialog
        open={retireOpen}
        onClose={() => setRetireOpen(false)}
        onConfirm={handleRetire}
        title="Retire this asset?"
        message={`This will remove "${asset.name}" from active assets. This action is recorded in the permanent history.`}
        confirmLabel="Retire asset"
        variant="danger"
        loading={retiring}
      />
    </div>
  );
}

function Field({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="w-4 h-4 text-slate-light mt-0.5" />}
      <div>
        <p className="text-xs text-slate-light">{label}</p>
        <p className="text-ink font-medium">{value}</p>
      </div>
    </div>
  );
}
