import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../api/services';
import { Card, StatusBadge, Button, Input, Select, Modal, ConfirmModal, EmptyState, Skeleton, PageHeader } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatTime } from '../../utils/helpers';
import { Search, BookOpen, Eye, X } from 'lucide-react';

const AdminBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllBookings({ status: statusFilter, search });
      setBookings(res.data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [statusFilter, search]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const openDetail = async (b) => {
    try {
      const res = await adminService.getBooking(b._id);
      setSelected(res.data.data);
      setDetailModal(true);
    } catch { toast.error('Failed to load booking details'); }
  };

  const handleCancel = async () => {
    setProcessing(true);
    try {
      await adminService.updateBookingStatus(cancelModal._id, 'CANCELLED');
      toast.success('Booking cancelled');
      setCancelModal(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally { setProcessing(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title="All Bookings" subtitle="View and manage all reservations" />

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="w-40">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </Select>
        </div>
        {(search || statusFilter) && (
          <button onClick={() => { setSearch(''); setStatusFilter(''); }} className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
      ) : bookings.length === 0 ? (
        <EmptyState icon={BookOpen} title="No bookings found" description="Try adjusting your filters." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Ref', 'User', 'Resource', 'Date', 'Time', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{b.bookingRef}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{b.user?.name}</p>
                      <p className="text-xs text-slate-500">{b.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{b.resource?.name}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDate(b.date)}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatTime(b.startTime)}–{formatTime(b.endTime)}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openDetail(b)} className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50" title="View details">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {b.status === 'CONFIRMED' && (
                          <button onClick={() => setCancelModal(b)} className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50" title="Cancel booking">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={detailModal} onClose={() => setDetailModal(false)} title="Booking Details" size="md">
        {selected && (
          <div className="space-y-3 text-sm">
            {[
              ['Reference', selected.bookingRef],
              ['User', `${selected.user?.name} (${selected.user?.email})`],
              ['Resource', selected.resource?.name],
              ['Location', selected.resource?.location],
              ['Date', formatDate(selected.date)],
              ['Time', `${formatTime(selected.startTime)} – ${formatTime(selected.endTime)}`],
              ['Purpose', selected.purpose],
              ['Attendees', selected.attendees],
              ['Status', <StatusBadge key="s" status={selected.status} />],
              ['Created', new Date(selected.createdAt).toLocaleString()],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-4 pb-2 border-b border-slate-100 last:border-0">
                <span className="text-xs font-medium text-slate-400 w-24 flex-shrink-0 pt-0.5">{label}</span>
                <span className="text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!cancelModal}
        onClose={() => setCancelModal(null)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message={`Cancel booking ${cancelModal?.bookingRef}? This action cannot be undone.`}
        confirmLabel="Cancel Booking"
        loading={processing}
      />
    </div>
  );
};

export default AdminBookings;
