import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, CalendarDays, User, Menu, X,
  LogOut, ChevronDown, Building2, Users, Layers
} from 'lucide-react';
import clsx from 'clsx';

const userNav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Resources', href: '/resources', icon: Building2 },
  { label: 'My Bookings', href: '/my-bookings', icon: BookOpen },
  { label: 'Calendar', href: '/calendar', icon: CalendarDays },
  { label: 'Profile', href: '/profile', icon: User },
];

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Resources', href: '/admin/resources', icon: Building2 },
  { label: 'All Bookings', href: '/admin/bookings', icon: BookOpen },
  { label: 'Calendar', href: '/admin/calendar', icon: CalendarDays },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Profile', href: '/profile', icon: User },
];

const NavLink = ({ item, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === item.href ||
    (item.href !== '/admin' && item.href !== '/dashboard' && location.pathname.startsWith(item.href));

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={clsx(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      <item.icon className={clsx('w-4 h-4', isActive ? 'text-blue-600' : 'text-slate-400')} />
      {item.label}
    </Link>
  );
};

const Sidebar = ({ onClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const nav = isAdmin ? adminNav : userNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-slate-200 flex-shrink-0">
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2" onClick={onClose}>
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-slate-900 text-sm">BookSpace</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {isAdmin && (
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
            Admin Panel
          </p>
        )}
        {nav.map((item) => (
          <NavLink key={item.href} item={item} onClick={onClose} />
        ))}
      </nav>

      {/* User info at bottom */}
      <div className="p-3 border-t border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-blue-700">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} title="Logout" className="p-1 rounded text-slate-400 hover:text-red-500">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-56 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-56 z-50">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
