import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Loader from '../../components/ui/Loader';
import { fetchIssues } from '../../redux/features/issues/issueThunk';

export default function IssuesList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
 const { items: issues = [], loading } = useSelector((state) => state.issues);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  useEffect(() => {
    dispatch(fetchIssues());
  }, [dispatch]);

  const filtered = issues.length >0 && useMemo(() => issues.filter((i) => {
    const assetName = i.asset?.name || i.assetName || '';
    const issueId = i._id || i.id || '';
    return (
      (assetName.toLowerCase().includes(search.toLowerCase()) || issueId.toLowerCase().includes(search.toLowerCase())) &&
      (!status || i.status === status) && (!priority || i.priority === priority)
    );
  }), [issues, search, status, priority]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Issues</h1>
        <p className="text-sm text-slate mt-0.5">Track, assign, and resolve reported issues.</p>
      </div>

      <Card padding="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input icon={Search} placeholder="Search by issue number or asset" value={search} onChange={(e) => setSearch(e.target.value)} containerClassName="flex-1" />
          <Select placeholder="All statuses" containerClassName="sm:w-52"
            options={['Reported', 'Assigned', 'Inspection Started', 'Maintenance In Progress', 'Waiting for Parts', 'Resolved', 'Closed', 'Reopened'].map((s) => ({ value: s, label: s }))}
            value={status} onChange={(e) => setStatus(e.target.value)} />
          <Select placeholder="All priorities" containerClassName="sm:w-44"
            options={['Low', 'Medium', 'High', 'Critical'].map((p) => ({ value: p, label: p }))}
            value={priority} onChange={(e) => setPriority(e.target.value)} />
        </div>
      </Card>

      <Card padding="p-0">
        {loading ? (
          <Loader label="Loading issues..." />
        ) : filtered.length === 0 ? (
          <EmptyState title="No issues found" description="Try adjusting your search or filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-light border-b border-line">
                  <th className="px-5 py-3 font-medium">Issue</th>
                  <th className="px-5 py-3 font-medium">Asset</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Technician</th>
                  <th className="px-5 py-3 font-medium">Reported</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.length >0 && filtered.map((i) => (
                  <tr key={i._id || i.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/issues/${i._id || i.id}`)}>
                    <td className="px-5 py-3.5"><span className="code-frame text-xs py-0.5">{i._id || i.id}</span></td>
                    <td className="px-5 py-3.5 text-ink font-medium">{i.asset?.name || i.assetName}</td>
                    <td className="px-5 py-3.5"><Badge>{i.priority}</Badge></td>
                    <td className="px-5 py-3.5"><Badge>{i.status}</Badge></td>
                    <td className="px-5 py-3.5 text-slate">{i.technician?.name || i.technician || '—'}</td>
                    <td className="px-5 py-3.5 text-slate">{i.createdAt ? new Date(i.createdAt).toLocaleDateString() : i.reported}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
