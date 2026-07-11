import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, Boxes, Wrench, ClipboardList, History, Settings,
} from 'lucide-react';

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/admin/assets', label: 'Assets', icon: Boxes },
  { to: '/admin/issues', label: 'Issues', icon: ClipboardList },
  { to: '/admin/history', label: 'Activity History', icon: History },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const TECH_LINKS = [
  { to: '/technician', label: 'My Work', icon: Wrench, end: true },
  { to: '/technician/history', label: 'History', icon: History },
];

export default function Sidebar({ role = 'admin' }) {
  const links = role === 'admin' ? ADMIN_LINKS : TECH_LINKS;

  return (
    <aside className="w-60 border-r border-line bg-white flex-shrink-0 hidden md:flex flex-col py-4">
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive ? 'bg-primary-50 text-primary-600' : 'text-slate hover:bg-gray-50 hover:text-ink'}`
            }
          >
            <Icon className="w-4.5 h-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pt-3 mt-3 border-t border-line">
        <div className="rounded-lg bg-primary-50 p-3">
          <p className="text-xs font-medium text-primary-600">Next service due</p>
          <p className="text-xs text-slate mt-1">3 assets need attention this week</p>
        </div>
      </div>
    </aside>
  );
}
