import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';

export default function Navbar({ user = { name: 'Ayesha Khan', role: 'Administrator' }, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="h-16 border-b border-line bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
          <span className="text-white font-display font-bold text-sm">M</span>
        </div>
        <span className="font-display font-semibold text-ink text-lg">MaintainIQ</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-4.5 h-4.5 text-slate" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-danger-500" />
        </button>

        <div className="relative" ref={ref}>
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium text-sm">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-ink leading-tight">{user.name}</p>
              <p className="text-xs text-slate-light leading-tight">{user.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-light" />
          </button>
          {open && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-line rounded-lg shadow-popover py-1 z-20">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-gray-50">
                <User className="w-4 h-4" /> Profile
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-gray-50">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <hr className="my-1 border-line" />
              <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger-500 hover:bg-danger-50">
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
