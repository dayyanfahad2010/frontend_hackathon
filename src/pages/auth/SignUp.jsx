import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, Building2 } from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { signup } from '../../redux/features/auth/authThunk';
import { clearAuthState } from '../../redux/features/auth/authSlice';
import { useToast } from '../../components/ui/Toast';

export default function SignUp() {
  const [form, setForm] = useState({ userName: '', email: '', organization: '', role: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.userName) err.name = 'Full name is required';
    if (!form.email) err.email = 'Email is required';
    if (!form.role) err.role = 'Select your role';
    if (!form.password || form.password.length < 6) err.password = 'Minimum 6 characters';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(clearAuthState());
    const result = await dispatch(signup(form));
    if (signup.fulfilled.match(result)) {
      toast(result.payload?.message || 'Account created successfully', 'success');
      const role = result.payload?.data?.role;
      navigate(role === 'technician' ? '/technician' : '/admin');
    } else {
      toast(result.payload?.message || 'Sign up failed. Please try again.', 'error');
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink mb-1">Create your account</h2>
      <p className="text-sm text-slate mb-8">Set up MaintainIQ for your organization.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full name" name="userName" icon={User} placeholder="Ayesha Khan" required
          value={form.userName} onChange={handleChange} error={errors.name} />
        <Input label="Email address" name="email" type="email" icon={Mail} placeholder="you@organization.com" required
          value={form.email} onChange={handleChange} error={errors.email} />
        <Input label="Organization" name="organization" icon={Building2} placeholder="Riverside Hospital"
          value={form.organization} onChange={handleChange} />
        <Select
          label="Your role" name="role" required
          options={[{ value: 'admin', label: 'Administrator' }, { value: 'technician', label: 'Technician' }, { value: 'supervisor', label: 'Supervisor' }]}
          value={form.role} onChange={handleChange} error={errors.role}
        />
        <Input label="Password" name="password" type="password" icon={Lock} placeholder="At least 6 characters" required
          value={form.password} onChange={handleChange} error={errors.password} />

        <Button type="submit" fullWidth loading={loading}>Create account</Button>
      </form>

      <p className="text-sm text-slate text-center mt-6">
        Already have an account? <Link to="/login" className="font-medium text-primary-500 hover:text-primary-600">Log in</Link>
      </p>
    </div>
  );
}
