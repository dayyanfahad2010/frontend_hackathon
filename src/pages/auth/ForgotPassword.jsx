import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, ArrowLeft, MailCheck } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { forgotPassword } from '../../redux/features/auth/authThunk';
import { useToast } from '../../components/ui/Toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    setError('');
    const result = await dispatch(forgotPassword({ email }));
    if (forgotPassword.fulfilled.match(result)) {
      setSent(true);
      toast(result.payload?.message || 'Reset link sent', 'success');
    } else {
      toast(result.payload?.message || 'Could not send reset link', 'error');
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
          <MailCheck className="w-5 h-5 text-success-500" />
        </div>
        <h2 className="font-display text-xl font-semibold text-ink mb-1">Check your email</h2>
        <p className="text-sm text-slate mb-6">We've sent a password reset link to <span className="font-medium text-ink">{email}</span></p>
        <Link to="/login" className="text-sm font-medium text-primary-500 hover:text-primary-600 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/login" className="text-sm text-slate hover:text-ink inline-flex items-center gap-1 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h2 className="font-display text-2xl font-semibold text-ink mb-1">Forgot password?</h2>
      <p className="text-sm text-slate mb-8">Enter your email and we'll send you a reset link.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address" type="email" icon={Mail} placeholder="you@organization.com" required
          value={email} onChange={(e) => setEmail(e.target.value)} error={error}
        />
        <Button type="submit" fullWidth loading={loading}>Send reset link</Button>
      </form>
    </div>
  );
}
