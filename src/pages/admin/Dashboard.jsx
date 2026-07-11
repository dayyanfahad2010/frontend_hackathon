import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Boxes, AlertTriangle, Wrench, CheckCircle2, TrendingUp } from 'lucide-react';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import { fetchAdminSummary } from '../../redux/features/dashboard/dashboardThunk';

const TONE = {
  primary: 'bg-primary-50 text-primary-500',
  amber: 'bg-amber-50 text-amber-500',
  info: 'bg-info-50 text-info-500',
  success: 'bg-success-50 text-success-500',
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminSummary, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchAdminSummary());
  }, [dispatch]);

  const summary = adminSummary || {};

  const SUMMARY = [
    { label: 'Total assets', value: summary.totalAssets ?? 0, icon: Boxes, tone: 'primary' },
    { label: 'Open issues', value: summary.openIssues ?? 0, icon: AlertTriangle, tone: 'amber' },
    { label: 'Under maintenance', value: summary.underMaintenance ?? 0, icon: Wrench, tone: 'info' },
    { label: 'Resolved this week', value: summary.resolvedThisWeek ?? 0, icon: CheckCircle2, tone: 'success' },
  ];

  const recentIssues = summary.recentIssues || [];
  const recurring = summary.recurringFailures || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Dashboard</h1>
        <p className="text-sm text-slate mt-0.5">Operational overview across all assets and issues.</p>
      </div>

      {loading && !adminSummary ? (
        <Loader label="Loading dashboard..." />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SUMMARY.map(({ label, value, icon: Icon, tone }) => (
              <Card key={label}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${TONE[tone]}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <p className="text-2xl font-display font-semibold text-ink">{value}</p>
                <p className="text-sm text-slate mt-0.5">{label}</p>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2" padding="p-0">
              <div className="p-5 border-b border-line">
                <CardHeader title="Recent issues" subtitle="Latest reported and in-progress issues" />
              </div>
              {recentIssues.length === 0 ? (
                <EmptyState title="No recent issues" description="Newly reported issues will show up here." />
              ) : (
                <div className="divide-y divide-line">
                  {recentIssues.map((issue) => (
                    <div key={issue._id || issue.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/admin/issues/${issue._id || issue.id}`)}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="code-frame text-xs py-1">{issue._id || issue.id}</span>
                          <Badge>{issue.priority}</Badge>
                        </div>
                        <p className="text-sm text-ink mt-1.5">{issue.asset?.name || issue.assetName}</p>
                      </div>
                      <div className="text-right">
                        <Badge>{issue.status}</Badge>
                        <p className="text-xs text-slate-light mt-1.5">
                          {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : issue.reported}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <CardHeader title="Recurring failures" subtitle="Assets flagged by AI pattern analysis" />
              {recurring.length === 0 ? (
                <p className="text-sm text-slate-light">No recurring failures detected.</p>
              ) : (
                <div className="space-y-3">
                  {recurring.map((r) => (
                    <div key={r.code} className="flex items-start gap-3 bg-danger-50/50 rounded-lg p-3">
                      <TrendingUp className="w-4 h-4 text-danger-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-ink">{r.asset || r.name}</p>
                        <p className="text-xs text-slate-light">{r.code}</p>
                        <p className="text-xs text-danger-500 mt-1">{r.count} issues in the last 30 days</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
