import { Link } from 'react-router-dom';
import { QrCode, ClipboardCheck, History, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const FEATURES = [
  { icon: QrCode, title: 'Digital identity for every asset', text: 'Register once, scan anywhere — a QR-accessible page for each physical asset.' },
  { icon: ClipboardCheck, title: 'AI-assisted issue triage', text: 'Natural-language complaints become structured, reviewable issue reports.' },
  { icon: History, title: 'Permanent maintenance history', text: 'Every inspection, part, and resolution is recorded and never lost.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">M</span>
          </div>
          <span className="font-display font-semibold text-ink text-lg">MaintainIQ</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate hover:text-ink">Log in</Link>
          <Link to="/signup"><Button size="sm">Get started</Button></Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-full px-3 py-1 mb-6">
          <Sparkles className="w-3 h-3" /> AI-Powered Asset Maintenance
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink leading-tight mb-5">
          Scan. Report.<br />Diagnose. Maintain.
        </h1>
        <p className="text-slate text-lg max-w-xl mx-auto mb-8">
          MaintainIQ gives every physical asset a digital identity — from issue report to resolution, with a permanent, accountable history.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/signup"><Button size="lg" icon={ArrowRight} iconPosition="right">Start free</Button></Link>
          <Link to="/login"><Button size="lg" variant="secondary">Log in</Button></Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20 grid sm:grid-cols-3 gap-6">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="border border-line rounded-xl2 p-6">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="font-display font-semibold text-ink mb-2">{title}</h3>
            <p className="text-sm text-slate">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
