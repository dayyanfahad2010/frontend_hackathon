import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader } from "@/components/common/Feedback";

/** Blocks access until we know whether the session cookie is valid. */
export function ProtectedRoute() {
  const { isAuthenticated, authChecked } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!authChecked) {
    return <Loader label="Checking your session…" className="min-h-screen" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

/** Restricts a subtree to one or more roles; redirects others to their dashboard. */
export function RoleRoute({ roles }) {
  const user = useSelector((s) => s.auth.user);

  if (!roles.includes(user?.role)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
}

/** Keeps logged-in users off auth pages like /login and /signup. */
export function PublicOnlyRoute() {
  const { isAuthenticated, authChecked } = useSelector((s) => s.auth);

  if (!authChecked) {
    return <Loader label="Loading…" className="min-h-screen" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
}
