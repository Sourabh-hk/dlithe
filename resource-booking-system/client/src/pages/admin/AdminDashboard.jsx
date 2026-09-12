import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../api/services';
import { Card, StatusBadge, Skeleton, PageHeader } from '../../components/ui';
import { formatDate, formatTime } from '../../utils/helpers';
import { Building2, BookOpen, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <Card className="p-5 flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value ?? '—'}</p>
    </div>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color === 'text-blue-600' ? 'bg-blue-50' : color === 'text-green-600' ? 'bg-green-50' : color === 'text-red-600' ? 'bg-red-50' : 'bg-slate-100'}`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <PageHeader title="Admin Dashboard" subtitle="Overview of all resources and bookings" />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Resources" value={stats?.totalResources} icon={Building2} color="text-slate-900" />
            <StatCard label="Available" value={stats?.availableResources} icon={CheckCircle} color="text-green-600" />
            <StatCard label="Total Users" value={stats?.totalUsers} icon={Users} color="text-blue-600" />
            <StatCard label="Total Bookings" value={stats?.totalBookings} icon={BookOpen} color="text-slate-900" />
            <StatCard label="Upcoming" value={stats?.confirmedBookings} icon={Clock} color="text-blue-600" />
            <StatCard label="Completed" value={stats?.completedBookings} icon={CheckCircle} color="text-green-600" />
            <StatCard label="Cancelled" value={stats?.cancelledBookings} icon={XCircle} color="text-red-600" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-700">Recent Bookings</h2>
              <Link to="/admin/bookings" className="text-xs text-blue-600 hover:underline">View all</Link>
            </div>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {['Reference', 'User', 'Resource', 'Date', 'Time', 'Status'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats?.recentBookings?.map((b) => (
                      <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-slate-600">{b.bookingRef}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-slate-900">{b.user?.name}</p>
                            <p className="text-xs text-slate-500">{b.user?.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{b.resource?.name}</td>
                        <td className="px-4 py-3 text-slate-600">{formatDate(b.date)}</td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatTime(b.startTime)}–{formatTime(b.endTime)}</td>
                        <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
