import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, History as HistoryIcon } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import { fetchAllHistory } from '../../redux/features/history/historyThunk';

export default function History() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allItems: history, loading } = useSelector((state) => state.history);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAllHistory());
  }, [dispatch]);

  const filtered = useMemo(() => history.filter((h) => {
    const q = search.toLowerCase();
    const assetName = h.asset?.name || h.assetName || '';
    return !q || assetName.toLowerCase().includes(q) || (h.action || '').toLowerCase().includes(q) || (h.actor || '').toLowerCase().includes(q);
  }), [history, search]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Activity history</h1>
        <p className="text-sm text-slate mt-0.5">Permanent, organization-wide log of everything that happened across assets and issues.</p>
      </div>

      <Card padding="p-4">
        <Input
          icon={Search} placeholder="Search by asset, action, or person"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <Card>
        {loading ? (
          <Loader label="Loading activity..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={HistoryIcon} title="No activity yet" description="Significant events across your organization will appear here." />
        ) : (
          <div className="space-y-4">
            {filtered.map((h, i) => (
              <div key={h._id || h.id || i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5" />
                  {i < filtered.length - 1 && <div className="w-px flex-1 bg-line" />}
                </div>
                <div className="pb-4 flex-1">
                  <p className="text-sm text-ink">{h.action}</p>
                  <p className="text-xs text-slate-light mt-0.5">
                    {h.date || (h.createdAt && new Date(h.createdAt).toLocaleString())} · {h.actor}
                    {h.asset?.code && (
                      <>
                        {' · '}
                        <span
                          className="text-primary-500 cursor-pointer hover:underline"
                          onClick={() => navigate(`/admin/assets/${h.asset.code}`)}
                        >
                          {h.asset.code}
                        </span>
                      </>
                    )}
                    {h.issue && ` · ${h.issue}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
