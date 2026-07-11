import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { createAsset, updateAsset } from '../../redux/features/assets/assetThunk';
import { useToast } from '../../components/ui/Toast';

const EMPTY_FORM = {
  name: '', assetCode: '', category: '', location: '', condition: '', technician: '',
};

export default function AssetFormModal({ open, onClose, asset = null, onSuccess }) {
  const isEdit = !!asset;
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setForm(asset ? {
        name: asset.name || '',
        assetCode: asset.assetCode || '',
        category: asset.category || '',
        location: asset.location || '',
        condition: asset.condition || '',
        technician: asset.technician || '',
      } : EMPTY_FORM);
      setErrors({});
    }
  }, [open, asset]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.name) err.name = 'Asset name is required';
    if (!form.assetCode) err.code = 'Asset code is required';
    if (!form.category) err.category = 'Category is required';
    if (!form.location) err.location = 'Location is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const action = isEdit
      ? await dispatch(updateAsset({ id: asset._id || asset.id || asset.code, data: form }))
      : await dispatch(createAsset(form));
    setLoading(false);

    const success = isEdit ? updateAsset.fulfilled.match(action) : createAsset.fulfilled.match(action);
    if (success) {
      toast(action.payload?.message || (isEdit ? 'Asset updated successfully' : 'Asset registered successfully'), 'success');
      onSuccess?.(action.payload?.data || action.payload);
      onClose();
    } else {
      toast(action.payload?.message || 'Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <Modal
      open={open} onClose={onClose} size="lg"
      title={isEdit ? 'Edit asset' : 'Register new asset'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>{isEdit ? 'Save changes' : 'Register asset'}</Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Asset name" name="name" required placeholder="e.g. Classroom Projector 01"
          value={form.name} onChange={handleChange} error={errors.name} />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Asset code" name="assetCode" required placeholder="Auto-generated if left blank"
            hint="Must be unique across the organization"
            value={form.assetCode} onChange={handleChange} error={errors.assetCode} disabled={isEdit} />
          <Select label="Category" name="category" required
            options={['AV Equipment', 'HVAC', 'Electrical', 'Plumbing', 'Mechanical', 'IT Equipment', 'Other'].map((c) => ({ value: c, label: c }))}
            value={form.category} onChange={handleChange} error={errors.category} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Location" name="location" required placeholder="e.g. Block C · Room 214"
            value={form.location} onChange={handleChange} error={errors.location} />
          <Select label="Condition" name="condition"
            options={['New', 'Good', 'Fair', 'Poor'].map((c) => ({ value: c, label: c }))}
            value={form.condition} onChange={handleChange} />
        </div>

        <Input label="Assign technician (ID or email)" name="technician" placeholder="technician@organization.com"
          value={form.technician} onChange={handleChange} />

        <p className="text-xs text-slate-light bg-gray-50 rounded-lg px-3 py-2">
          A QR code and public asset link will be generated automatically after this asset is registered.
        </p>
      </form>
    </Modal>
  );
}
