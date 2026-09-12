import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../api/services';
import { Card, StatusBadge, Button, Skeleton, EmptyState, PageHeader } from '../../components/ui';
import { getGreeting, formatDate, formatTime } from '../../utils/helpers';
import { CalendarDays, Building2, BookOpen, Calendar, Clock, Plus } from 'lucide-react';

const StatCard = ({ label, value, color }) => (
  <Card className="p-5">
    <p className="text-sm text-slate-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getMy()
      .then((res) => setBookings(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter((b) => b.status === 'CONFIRMED');
  const completed = bookings.filter((b) => b.status === 'COMPLETED');
  const cancelled = bookings.filter((b) => b.status === 'CANCELLED');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900">
          {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">Here's what's happening with your bookings.</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Bookings" value={bookings.length} color="text-slate-900" />
          <StatCard label="Upcoming" value={upcoming.length} color="text-blue-600" />
          <StatCard label="Completed" value={completed.length} color="text-green-600" />
          <StatCard label="Cancelled" value={cancelled.length} color="text-red-600" />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming bookings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">Upcoming Bookings</h2>
            <Link to="/my-bookings" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
            </div>
          ) : upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No upcoming bookings"
              description="You don't have any upcoming reservations."
              action={<Link to="/resources"><Button size="sm">Find a Resource</Button></Link>}
            />
          ) : (
            <div className="space-y-2">
              {upcoming.slice(0, 5).map((b) => (
                <Link key={b._id} to={`/my-bookings/${b._id}`}>
                  <Card className="p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Building2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{b.resource?.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{b.resource?.location}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <CalendarDays className="w-3 h-3" />{formatDate(b.date)}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />{formatTime(b.startTime)} – {formatTime(b.endTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/resources">
              <Card className="p-4 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Find a Resource</p>
                  <p className="text-xs text-slate-500">Browse available spaces</p>
                </div>
              </Card>
            </Link>
            <Link to="/my-bookings">
              <Card className="p-4 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">My Bookings</p>
                  <p className="text-xs text-slate-500">View reservations</p>
                </div>
              </Card>
            </Link>
            <Link to="/calendar">
              <Card className="p-4 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Calendar View</p>
                  <p className="text-xs text-slate-500">See availability</p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
