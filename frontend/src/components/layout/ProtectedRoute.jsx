import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Spinner from '../ui/Spinner.jsx';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Spinner size={32} className="text-primary-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !hasRole(...roles)) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-2 text-center">
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Access Restricted</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your role ({user.role}) does not have permission to view this page.
        </p>
      </div>
    );
  }

  return children;
}
