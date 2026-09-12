import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute, AdminRoute, PublicRoute } from './routes/guards';
import AppLayout from './layouts/AppLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User pages
import Dashboard from './pages/user/Dashboard';
import Resources from './pages/user/Resources';
import ResourceDetail from './pages/user/ResourceDetail';
import BookingForm from './pages/user/BookingForm';
import MyBookings from './pages/user/MyBookings';
import BookingDetail from './pages/user/BookingDetail';
import CalendarPage from './pages/user/CalendarPage';
import Profile from './pages/user/Profile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminResources from './pages/admin/AdminResources';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCalendar from './pages/admin/AdminCalendar';
import AdminUsers from './pages/admin/AdminUsers';

// Error pages
import { NotFound, AccessDenied } from './pages/ErrorPages';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public root redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Auth routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* User routes */}
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="resources" element={<Resources />} />
              <Route path="resources/:id" element={<ResourceDetail />} />
              <Route path="book/:resourceId" element={<BookingForm />} />
              <Route path="my-bookings" element={<MyBookings />} />
              <Route path="my-bookings/:id" element={<BookingDetail />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Admin routes */}
            <Route path="/" element={<AdminRoute><AppLayout /></AdminRoute>}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/resources" element={<AdminResources />} />
              <Route path="admin/bookings" element={<AdminBookings />} />
              <Route path="admin/calendar" element={<AdminCalendar />} />
              <Route path="admin/users" element={<AdminUsers />} />
            </Route>

            {/* Error pages */}
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
