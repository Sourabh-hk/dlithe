import React, { useState, useEffect } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import BookingCard from '../components/BookingCard';
import ReviewModal from '../components/ReviewModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import './Bookings.css';

const Bookings = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('learner'); // 'learner' or 'mentor'
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let res;
      if (activeTab === 'mentor') {
        res = await bookingService.getIncomingBookings();
      } else {
        res = await bookingService.getMyBookings();
      }
      setBookings(res.data.bookings || res.data || []);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const handleAccept = async (id) => {
    try {
      await bookingService.updateStatus(id, 'accepted');
      toast.success('Booking accepted');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to accept booking');
    }
  };

  const handleReject = async (id) => {
    try {
      await bookingService.updateStatus(id, 'rejected');
      toast.success('Booking rejected');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to reject booking');
    }
  };

  const handleCancel = async (id) => {
    try {
      await bookingService.updateStatus(id, 'cancelled');
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleComplete = async (id) => {
    try {
      await bookingService.updateStatus(id, 'completed');
      toast.success('Session marked as completed');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="bookings-page page">
      <div className="container">
        <div className="bookings-header">
          <h1 className="bookings-title">My Sessions & Bookings</h1>
          <p className="bookings-subtitle">
            Track and manage your scheduled sessions and learning milestones
          </p>
        </div>

        {/* Tab Selection */}
        {(user?.role === 'mentor' || (user?.skillsOffered && user?.skillsOffered.length > 0)) && (
          <div className="bookings-tabs">
            <button
              className={`bookings-tab ${activeTab === 'learner' ? 'bookings-tab--active' : ''}`}
              onClick={() => {
                setActiveTab('learner');
                setStatusFilter('all');
              }}
            >
              As Learner
            </button>
            <button
              className={`bookings-tab ${activeTab === 'mentor' ? 'bookings-tab--active' : ''}`}
              onClick={() => {
                setActiveTab('mentor');
                setStatusFilter('all');
              }}
            >
              As Mentor (Incoming)
            </button>
          </div>
        )}

        {/* Status Filters */}
        <div className="bookings-filter-bar">
          {['all', 'pending', 'accepted', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              className={`bookings-filter-chip ${statusFilter === st ? 'bookings-filter-chip--active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Bookings Content */}
        {loading ? (
          <LoadingSkeleton count={4} type="card" />
        ) : filteredBookings.length > 0 ? (
          <div className="bookings-grid">
            {filteredBookings.map((b) => (
              <BookingCard
                key={b._id || b.id}
                booking={b}
                isMentor={activeTab === 'mentor'}
                onAccept={handleAccept}
                onReject={handleReject}
                onCancel={handleCancel}
                onComplete={handleComplete}
                onReview={(booking) => setSelectedBookingForReview(booking)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title={`No ${statusFilter !== 'all' ? statusFilter : ''} bookings found`}
            description={
              activeTab === 'learner'
                ? "You don't have any bookings matching this criteria. Browse available skills and schedule a session!"
                : "No student booking requests found matching this status filter."
            }
            actionLabel={activeTab === 'learner' ? 'Explore Skills' : undefined}
            actionLink={activeTab === 'learner' ? '/explore' : undefined}
          />
        )}
      </div>

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          isOpen={Boolean(selectedBookingForReview)}
          onClose={() => setSelectedBookingForReview(null)}
          booking={selectedBookingForReview}
          onSuccess={() => {
            fetchBookings();
          }}
        />
      )}
    </div>
  );
};

export default Bookings;
