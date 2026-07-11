import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { logout } from '../../redux/features/auth/authThunk';
import { logoutLocal } from '../../redux/features/auth/authSlice';
import { useToast } from '../ui/Toast';

export default function Layout({ role = 'admin' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);

  const displayUser = {
    name: user?.name || (role === 'admin' ? 'Admin' : 'Technician'),
    role: user?.role === 'admin' ? 'Administrator' : user?.role === 'technician' ? 'Technician' : role,
  };

  const handleLogout = async () => {
    const result = await dispatch(logout());
    dispatch(logoutLocal());
    if (logout.fulfilled.match(result)) {
      toast('Logged out successfully', 'success');
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar user={displayUser} onLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar role={role} />
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
