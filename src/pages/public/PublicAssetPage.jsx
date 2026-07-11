import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import ReportIssueForm from './ReportIssueForm';
import { fetchPublicAsset } from '../../redux/features/public/publicThunk';
import { resetReportedIssue } from '../../redux/features/public/publicSlice';

export default function PublicAssetPage() {
  const { code } = useParams();
  const dispatch = useDispatch();
  const { asset, loading, error } = useSelector((state) => state.public);
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    if (code) dispatch(fetchPublicAsset(code));
  }, [dispatch, code]);

  const isRetired = asset?.status === 'Retired';

  const backToAsset = () => {
    dispatch(resetReportedIssue());
    setReporting(false);
  };

  if (loading && !asset) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader label="Loading asset..." />
      </div>
    );
  }

  if (error && !asset) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <EmptyState icon={AlertTriangle} title="Asset not found" description="This QR code or link doesn't match any registered asset." />
      </div>
    );
  }

  if (!asset) return null;

  if (reporting) {
    return (
      <div className="min-h-screen bg-bg py-8 px-4">
        <div className="max-w-md mx-auto">
          <ReportIssueForm asset={asset} onBack={backToAsset} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
            <span className="text-white font-display font-bold text-xs">M</span>
          </div>
          <span className="font-display font-semibold text-ink">MaintainIQ</span>
        </div>

        <Card className="mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="font-display text-lg font-semibold text-ink">{asset.name}</h1>
              <span className="code-frame mt-1">{asset.code}</span>
            </div>
            <Badge>{asset.status || 'Operational'}</Badge>
          </div>

          {isRetired && (
            <div className="flex items-center gap-2 bg-gray-100 text-slate text-xs rounded-lg px-3 py-2 mb-3">
              <AlertTriangle className="w-3.5 h-3.5" />
              This asset has been retired and is no longer in active service.
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm mt-4">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-light mt-0.5" />
              <div>
                <p className="text-xs text-slate-light">Location</p>
                <p className="text-ink font-medium">{asset.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-light mt-0.5" />
              <div>
                <p className="text-xs text-slate-light">Condition</p>
                <p className="text-ink font-medium">{asset.condition || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-slate-light mt-0.5" />
              <div>
                <p className="text-xs text-slate-light">Last service</p>
                <p className="text-ink font-medium">{asset.lastService || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-slate-light mt-0.5" />
              <div>
                <p className="text-xs text-slate-light">Next service</p>
                <p className="text-ink font-medium">{asset.nextService || '—'}</p>
              </div>
            </div>
          </div>
        </Card>

        {asset.activity?.length > 0 && (
          <Card className="mb-4">
            <h3 className="text-sm font-medium text-ink mb-3">Recent activity</h3>
            <div className="space-y-3">
              {asset.activity.map((a, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-slate-light w-20 flex-shrink-0">{a.date}</span>
                  <span className="text-ink">{a.action}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {!isRetired && (
          <Button fullWidth size="lg" onClick={() => setReporting(true)}>Report an issue</Button>
        )}
      </div>
    </div>
  );
}
