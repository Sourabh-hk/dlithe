import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../../api/services';
import { Card, StatusBadge, Button, ConfirmModal, Skeleton } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatTime } from '../../utils/helpers';
import { ArrowLeft, Building2, CalendarDays, Clock, Users, AlertCircle } from 'lucide-react';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    bookingService.getOne(id)
      .then((res) => setBooking(res.data.data))
      .catch(() => navigate('/my-bookings'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await bookingService.cancel(id);
      toast.success('Booking cancelled successfully');
      setBooking((prev) => ({ ...prev, status: 'CANCELLED' }));
      setCancelModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
  if (!booking) return null;

  const canCancel = booking.status === 'CONFIRMED';

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to="/my-bookings" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> My Bookings
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Booking Reference</p>
          <h1 className="text-xl font-bold text-slate-900">{booking.bookingRef}</h1>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <Card className="divide-y divide-slate-100">
        <div className="p-5">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Resource</h2>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-md flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{booking.resource?.name}</p>
              <p className="text-sm text-slate-500">{booking.resource?.type} · {booking.resource?.location}</p>
            </div>
          </div>
        </div>

        <div className="p-5 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">Date</p>
              <p className="text-sm font-medium text-slate-900">{formatDate(booking.date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">Time</p>
              <p className="text-sm font-medium text-slate-900">{formatTime(booking.startTime)} – {formatTime(booking.endTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">Attendees</p>
              <p className="text-sm font-medium text-slate-900">{booking.attendees}</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <p className="text-xs text-slate-400 mb-1">Purpose</p>
          <p className="text-sm text-slate-900">{booking.purpose}</p>
        </div>

        <div className="p-5">
          <p className="text-xs text-slate-400 mb-1">Booked on</p>
          <p className="text-sm text-slate-900">{new Date(booking.createdAt).toLocaleString()}</p>
        </div>
      </Card>

      {booking.status === 'COMPLETED' && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-600">
          <AlertCircle className="w-4 h-4 text-slate-400" />
          This booking has been completed and cannot be cancelled.
        </div>
      )}

      {canCancel && (
        <div className="mt-4">
          <Button variant="danger" onClick={() => setCancelModal(true)} className="w-full">
            Cancel Booking
          </Button>
        </div>
      )}

      <ConfirmModal
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this reservation? This action cannot be undone."
        confirmLabel="Cancel Booking"
        loading={cancelling}
      />
    </div>
  );
};

export default BookingDetail;
