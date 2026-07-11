import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: { icon: CheckCircle2, cls: 'text-success-500 bg-success-50' },
  error: { icon: XCircle, cls: 'text-danger-500 bg-danger-50' },
  warning: { icon: AlertCircle, cls: 'text-amber-500 bg-amber-50' },
  info: { icon: Info, cls: 'text-info-500 bg-info-50' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    if (duration) setTimeout(() => remove(id), duration);
  }, [remove]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80">
        {toasts.map(({ id, message, type }) => {
          const { icon: Icon, cls } = ICONS[type] || ICONS.info;
          return (
            <div key={id} className="animate-toast-in bg-white border border-line rounded-lg shadow-popover px-4 py-3 flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${cls}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-sm text-ink flex-1 pt-0.5">{message}</p>
              <button onClick={() => remove(id)} className="text-slate-light hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
