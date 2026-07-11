import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';

import AuthLayout from './components/layout/AuthLayout';
import Layout from './components/layout/Layout';
import ProtectedRoute from './route/ProtectedRoute';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import DetailPage from './pages/DetailPage';

import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import PublicAssetPage from './pages/public/PublicAssetPage';

import Dashboard from './pages/admin/Dashboard';
import AssetsList from './pages/admin/AssetsList';
import IssuesList from './pages/admin/IssuesList';
import IssueDetail from './pages/admin/IssueDetail';
import AdminHistory from './pages/admin/History';
import AdminSettings from './pages/admin/Settings';

import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechnicianHistory from './pages/technician/History';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/asset/:code" element={<PublicAssetPage />} />

          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Admin (protected) */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<Layout role="admin" />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/assets" element={<AssetsList />} />
              <Route path="/admin/assets/:code" element={<DetailPage />} />
              <Route path="/admin/issues" element={<IssuesList />} />
              <Route path="/admin/issues/:id" element={<IssueDetail />} />
              <Route path="/admin/history" element={<AdminHistory />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Technician (protected) */}
          <Route element={<ProtectedRoute allowedRoles={['technician']} />}>
            <Route element={<Layout role="technician" />}>
              <Route path="/technician" element={<TechnicianDashboard />} />
              <Route path="/technician/issues/:id" element={<IssueDetail />} />
              <Route path="/technician/history" element={<TechnicianHistory />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
