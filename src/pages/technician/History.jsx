import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, History as HistoryIcon } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import { fetchMyIssues } from '../../redux/features/issues/issueThunk';

const DONE_STATUSES = ['Resolved', 'Closed'];

export default function TechnicianHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myIssues, loading } = useSelector((state) => state.issues);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchMyIssues());
  }, [dispatch]);

  const completed = useMemo(
    () => myIssues.filter((i) => DONE_STATUSES.includes(i.status)),
    [myIssues]
  );

  const filtered = useMemo(() => completed.filter((i) => {
    const q = search.toLowerCase();
    const assetName = i.asset?.name || i.assetName || '';
    return !q || assetName.toLowerCase().includes(q) || (i._id || i.id || '').toLowerCase().includes(q);
  }), [completed, search]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">My history</h1>
        <p className="text-sm text-slate mt-0.5">Issues you've resolved or closed.</p>
      </div>

      <Card padding="p-4">
        <Input icon={Search} placeholder="Search by asset or issue number" value={search} onChange={(e) => setSearch(e.target.value)} />
      </Card>

      <Card padding="p-0">
        {loading ? (
          <Loader label="Loading history..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={HistoryIcon} title="No completed work yet" description="Issues you resolve will show up here." />
        ) : (
          <div className="divide-y divide-line">
            {filtered.map((i) => (
              <div key={i._id || i.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/technician/issues/${i._id || i.id}`)}>
                <div>
                  <span className="code-frame text-xs py-0.5">{i._id || i.id}</span>
                  <p className="text-sm text-ink mt-1.5">{i.asset?.name || i.assetName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{i.priority}</Badge>
                  <Badge>{i.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
