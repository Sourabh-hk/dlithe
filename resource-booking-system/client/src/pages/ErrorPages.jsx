import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui';
import { ShieldAlert } from 'lucide-react';

export const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
    <div className="text-center">
      <p className="text-6xl font-bold text-slate-200 mb-4">404</p>
      <h1 className="text-xl font-semibold text-slate-800 mb-2">Page Not Found</h1>
      <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard"><Button>Go to Dashboard</Button></Link>
    </div>
  </div>
);

export const AccessDenied = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
    <div className="text-center">
      <ShieldAlert className="w-12 h-12 text-red-300 mx-auto mb-4" />
      <h1 className="text-xl font-semibold text-slate-800 mb-2">Access Denied</h1>
      <p className="text-slate-500 mb-6">You don't have permission to access this page.</p>
      <Link to="/dashboard"><Button>Go to Dashboard</Button></Link>
    </div>
  </div>
);
