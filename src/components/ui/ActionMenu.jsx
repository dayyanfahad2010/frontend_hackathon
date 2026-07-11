import { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';

export default function ActionMenu({ items = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-line rounded-lg shadow-popover py-1 z-20">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick?.(); setOpen(false); }}
              disabled={item.disabled}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors
                ${item.danger ? 'text-danger-500 hover:bg-danger-50' : 'text-ink hover:bg-gray-50'}
                disabled:text-slate-light disabled:cursor-not-allowed`}
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
