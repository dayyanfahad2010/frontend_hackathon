import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Wrench, Clock, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Loader from '../../components/ui/Loader';
import { fetchMyIssues } from '../../redux/features/issues/issueThunk';
import { fetchTechnicianSummary } from '../../redux/features/dashboard/dashboardThunk';

export default function TechnicianDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myIssues, loading } = useSelector((state) => state.issues);
  const { technicianSummary } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchMyIssues());
    dispatch(fetchTechnicianSummary());
  }, [dispatch]);

  const summary = technicianSummary || {};
  const STATS = [
    { label: 'Assigned to you', value: summary.assignedCount ?? myIssues?.length, icon: Wrench },
    { label: 'Due today', value: summary.dueToday ?? 0, icon: Clock },
    { label: 'Resolved this week', value: summary.resolvedThisWeek ?? 0, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">My work</h1>
        <p className="text-sm text-slate mt-0.5">Issues currently assigned to you.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {STATS.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
              <Icon className="w-4.5 h-4.5 text-primary-500" />
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-ink">{value}</p>
              <p className="text-xs text-slate">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card padding="p-0">
        {loading ? (
          <Loader label="Loading your issues..." />
        ) : myIssues?.length === 0 ? (
          <EmptyState icon={Wrench} title="No assigned issues" description="You're all caught up — new assignments will appear here." />
        ) : (
          <div className="divide-y divide-line">
            {myIssues && myIssues.map((a) => (
              <div key={a._id || a.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/technician/issues/${a._id || a.id}`)}>
                <div>
                  <span className="code-frame text-xs py-1">{a._id || a.id}</span>
                  <p className="text-sm font-medium text-ink mt-1.5">{a.asset?.name || a.assetName}</p>
                  <p className="text-xs text-slate-light">{a.asset?.location || a.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{a.priority}</Badge>
                  <Badge>{a.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
