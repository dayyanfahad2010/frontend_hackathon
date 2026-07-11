import { Outlet } from 'react-router-dom';
import { QrCode, History, ClipboardCheck } from 'lucide-react';

const POINTS = [
  { icon: QrCode, text: 'Give every asset a digital identity and QR-accessible page' },
  { icon: ClipboardCheck, text: 'Triage and assign issues with AI-assisted structuring' },
  { icon: History, text: 'Keep a permanent, accountable maintenance history' },
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left: brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-primary-600 text-white p-10 relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-primary-500/30" />
        <div className="absolute -left-16 bottom-0 w-56 h-56 rounded-full bg-primary-700/40" />

        <div className="relative flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
            <span className="font-display font-bold">M</span>
          </div>
          <span className="font-display font-semibold text-lg">MaintainIQ</span>
        </div>

        <div className="relative">
          <h1 className="font-display text-3xl font-semibold leading-tight mb-6">
            Scan. Report.<br />Diagnose. Maintain.
          </h1>
          <div className="space-y-4">
            {POINTS.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-sm text-primary-50 pt-1.5">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-primary-100">AI-Powered QR Maintenance & Asset History Platform</p>
      </div>

      {/* Right: form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
