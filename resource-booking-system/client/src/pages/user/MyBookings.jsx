import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../api/services';
import { Card, StatusBadge, Button, Select, EmptyState, Skeleton, PageHeader } from '../../components/ui';
import { formatDate, formatTime } from '../../utils/helpers';
import { BookOpen, CalendarDays, Clock, Building2, ChevronRight } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const params = filter !== 'ALL' ? { status: filter } : {};
    bookingService.getMy(params)
      .then((res) => setBookings(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="My Bookings"
        subtitle="View and manage your reservations"
        actions={
          <Link to="/resources">
            <Button size="sm">New Booking</Button>
          </Link>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              filter === f
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No bookings found"
          description={filter === 'ALL' ? "You haven't made any bookings yet." : `No ${filter.toLowerCase()} bookings.`}
          action={<Link to="/resources"><Button size="sm">Find a Resource</Button></Link>}
        />
      ) : (
        <div className="space-y-2">
          {bookings.map((b) => (
            <Link key={b._id} to={`/my-bookings/${b._id}`}>
              <Card className="p-4 hover:border-slate-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{b.resource?.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{b.purpose}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <CalendarDays className="w-3 h-3" />{formatDate(b.date)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />{formatTime(b.startTime)} – {formatTime(b.endTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={b.status} />
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
