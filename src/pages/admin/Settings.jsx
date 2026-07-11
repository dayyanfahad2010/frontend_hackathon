import { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Building2, Shield, Bell, Mail as MailIcon } from 'lucide-react';
import Card, { CardHeader } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-primary-500' : 'bg-line'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4.5' : ''}`} />
    </button>
  );
}

export default function Settings() {
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [org, setOrg] = useState(user?.organization || '');
  const [prefs, setPrefs] = useState({
    issueAlerts: true,
    resolutionAlerts: true,
    serviceReminders: true,
    weeklyDigest: false,
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // No updateProfile thunk wired yet — hook this up to authThunk once the
    // backend exposes PATCH /auth/me, then dispatch it here.
    toast('Profile changes are ready to save once the update-profile API is connected.', 'info');
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Settings</h1>
        <p className="text-sm text-slate mt-0.5">Manage your account and organization preferences.</p>
      </div>

      <Card>
        <CardHeader title="Profile" subtitle="Your account information" />
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input label="Full name" icon={User} value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email address" icon={Mail} value={email} disabled hint="Contact an administrator to change your email" />
          <Input label="Organization" icon={Building2} value={org} onChange={(e) => setOrg(e.target.value)} />
          <div className="flex items-center gap-2 text-sm text-slate bg-gray-50 rounded-lg px-3 py-2">
            <Shield className="w-4 h-4 text-slate-light" />
            Role: <span className="font-medium text-ink capitalize">{user?.role || 'Administrator'}</span>
          </div>
          <Button type="submit">Save changes</Button>
        </form>
      </Card>

      <Card>
        <CardHeader title="Notifications" subtitle="Choose what you get notified about" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <Bell className="w-4 h-4 text-slate-light mt-0.5" />
              <div>
                <p className="text-sm text-ink">New issue reported</p>
                <p className="text-xs text-slate-light">Get notified when a new issue comes in</p>
              </div>
            </div>
            <Toggle checked={prefs.issueAlerts} onChange={(v) => setPrefs({ ...prefs, issueAlerts: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <Bell className="w-4 h-4 text-slate-light mt-0.5" />
              <div>
                <p className="text-sm text-ink">Issue resolved</p>
                <p className="text-xs text-slate-light">Get notified when an issue is resolved</p>
              </div>
            </div>
            <Toggle checked={prefs.resolutionAlerts} onChange={(v) => setPrefs({ ...prefs, resolutionAlerts: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <Bell className="w-4 h-4 text-slate-light mt-0.5" />
              <div>
                <p className="text-sm text-ink">Upcoming service reminders</p>
                <p className="text-xs text-slate-light">Alerts before an asset's next scheduled service</p>
              </div>
            </div>
            <Toggle checked={prefs.serviceReminders} onChange={(v) => setPrefs({ ...prefs, serviceReminders: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <MailIcon className="w-4 h-4 text-slate-light mt-0.5" />
              <div>
                <p className="text-sm text-ink">Weekly summary email</p>
                <p className="text-xs text-slate-light">A digest of activity across your organization</p>
              </div>
            </div>
            <Toggle checked={prefs.weeklyDigest} onChange={(v) => setPrefs({ ...prefs, weeklyDigest: v })} />
          </div>
        </div>
      </Card>
    </div>
  );
}
