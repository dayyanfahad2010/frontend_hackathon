import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { resetPassword } from '../../redux/features/auth/authThunk';
import { useToast } from '../../components/ui/Toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.password || form.password.length < 6) err.password = 'Minimum 6 characters';
    if (form.confirmPassword !== form.password) err.confirmPassword = 'Passwords do not match';
    if (!token) err.token = 'Reset token is missing or invalid';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(resetPassword({ token, password: form.password }));
    if (resetPassword.fulfilled.match(result)) {
      setDone(true);
      toast(result.payload?.message || 'Password reset successfully', 'success');
    } else {
      toast(result.payload?.message || 'Could not reset password', 'error');
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-5 h-5 text-success-500" />
        </div>
        <h2 className="font-display text-xl font-semibold text-ink mb-1">Password updated</h2>
        <p className="text-sm text-slate mb-6">You can now log in with your new password.</p>
        <Button fullWidth onClick={() => navigate('/login')}>Go to login</Button>
      </div>
    );
  }

  return (
    <div>
      <Link to="/login" className="text-sm text-slate hover:text-ink inline-flex items-center gap-1 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h2 className="font-display text-2xl font-semibold text-ink mb-1">Reset password</h2>
      <p className="text-sm text-slate mb-8">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New password" name="password" type="password" icon={Lock}
          placeholder="At least 6 characters" required
          value={form.password} onChange={handleChange} error={errors.password}
        />
        <Input
          label="Confirm new password" name="confirmPassword" type="password" icon={Lock}
          placeholder="Re-enter password" required
          value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword}
        />
        {errors.token && <p className="text-xs text-danger-500">{errors.token}</p>}
        <Button type="submit" fullWidth loading={loading}>Reset password</Button>
      </form>
    </div>
  );
}
