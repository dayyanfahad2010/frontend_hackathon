import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, QrCode } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ActionMenu from '../../components/ui/ActionMenu';
import EmptyState from '../../components/ui/EmptyState';
import Loader from '../../components/ui/Loader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import AssetFormModal from './AssetFormModal';
import { fetchAssets, deleteAsset } from '../../redux/features/assets/assetThunk';
import { useToast } from '../../components/ui/Toast';

export default function AssetsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { items: assets, loading } = useSelector((state) => state.assets);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  const filtered = useMemo(() => assets.filter((a) =>
    ((a.name || '').toLowerCase().includes(search.toLowerCase()) || (a.code || '').toLowerCase().includes(search.toLowerCase())) &&
    (!status || a.status === status)
  ), [assets, search, status]);

  const openEdit = (asset) => { setEditingAsset(asset); setShowForm(true); };
  const openCreate = () => { setEditingAsset(null); setShowForm(true); };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const action = await dispatch(deleteAsset(deleteTarget._id || deleteTarget.id || deleteTarget.code));
    setDeleting(false);
    setDeleteTarget(null);
    if (deleteAsset.fulfilled.match(action)) {
      toast(action.payload?.message || 'Asset deleted successfully', 'success');
    } else {
      toast(action.payload?.message || 'Could not delete asset', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Assets</h1>
          <p className="text-sm text-slate mt-0.5">{assets.length} registered assets across your organization.</p>
        </div>
        <Button icon={Plus} onClick={openCreate}>Register asset</Button>
      </div>

      <Card padding="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            icon={Search} placeholder="Search by name or asset code"
            value={search} onChange={(e) => setSearch(e.target.value)}
            containerClassName="flex-1"
          />
          <Select
            placeholder="All statuses" containerClassName="sm:w-56"
            options={['Operational', 'Issue Reported', 'Under Inspection', 'Under Maintenance', 'Out of Service', 'Retired'].map((s) => ({ value: s, label: s }))}
            value={status} onChange={(e) => setStatus(e.target.value)}
          />
        </div>
      </Card>

      <Card padding="p-0">
        {loading ? (
          <Loader label="Loading assets..." />
        ) : filtered.length === 0 ? (
          <EmptyState title="No assets found" description="Try adjusting your search or filters, or register a new asset." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-light border-b border-line">
                  <th className="px-5 py-3 font-medium">Asset</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Next service</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((a) => (
                  <tr key={a._id || a.id || a.code} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/assets/${a.code}`)}>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-ink">{a.name}</p>
                      <span className="code-frame text-xs py-0.5 mt-1">{a.code}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate">{a.category}</td>
                    <td className="px-5 py-3.5 text-slate">{a.location}</td>
                    <td className="px-5 py-3.5"><Badge>{a.status || 'Operational'}</Badge></td>
                    <td className="px-5 py-3.5 text-slate">{a.nextService || '—'}</td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu items={[
                        { label: 'View public page', icon: QrCode, onClick: () => navigate(`/asset/${a.code}`) },
                        { label: 'Edit asset', onClick: () => openEdit(a) },
                        { label: 'Retire asset', danger: true, onClick: () => setDeleteTarget(a) },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AssetFormModal open={showForm} onClose={() => setShowForm(false)} asset={editingAsset} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Retire this asset?"
        message={`This will remove "${deleteTarget?.name}" from active assets. This action is recorded in the permanent history.`}
        confirmLabel="Retire asset"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
