import { X } from 'lucide-react';
import { useEffect } from 'react';

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className={`relative w-full ${SIZES[size]} bg-white rounded-xl2 shadow-popover animate-toast-in max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h3 className="font-display font-semibold text-ink">{title}</h3>
          <button onClick={onClose} className="text-slate-light hover:text-ink transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto scrollbar-thin">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-line flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
