import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { login } from '../../redux/features/auth/authThunk';
import { clearAuthState } from '../../redux/features/auth/authSlice';
import { useToast } from '../../components/ui/Toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.email) err.email = 'Email is required';
    if (!form.password) err.password = 'Password is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(clearAuthState());
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      toast(result.payload?.message || 'Logged in successfully', 'success');
      const role = result.payload?.data?.role;
      const redirectTo = location.state?.from?.pathname;
      if (redirectTo) navigate(redirectTo);
      else if (role === 'technician') navigate('/technician');
      else navigate('/admin');
    } else {
      toast(result.payload?.message || 'Login failed. Please try again.', 'error');
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink mb-1">Welcome back</h2>
      <p className="text-sm text-slate mb-8">Log in to manage assets, issues and maintenance.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address" name="email" type="email" icon={Mail}
          placeholder="you@organization.com" required
          value={form.email} onChange={handleChange} error={errors.email}
        />
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-ink">Password <span className="text-danger-500">*</span></label>
            <Link to="/forgot-password" className="text-xs font-medium text-primary-500 hover:text-primary-600">Forgot password?</Link>
          </div>
          <Input
            name="password" type="password" icon={Lock}
            placeholder="Enter your password"
            value={form.password} onChange={handleChange} error={errors.password}
          />
        </div>

        <Button type="submit" fullWidth loading={loading}>Log in</Button>
      </form>

      <p className="text-sm text-slate text-center mt-6">
        Don't have an account? <Link to="/signup" className="font-medium text-primary-500 hover:text-primary-600">Sign up</Link>
      </p>
    </div>
  );
}
