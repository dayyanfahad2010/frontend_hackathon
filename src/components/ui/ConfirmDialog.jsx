import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  variant = 'danger',
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-danger-50 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-danger-500" />
        </div>
        <p className="text-sm text-slate pt-1.5">{message}</p>
      </div>
    </Modal>
  );
}
