import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  BookOpen,
  DollarSign,
  Star,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { skillService } from '../services/skillService';
import BookingCard from '../components/BookingCard';
import SkillCard from '../components/SkillCard';
import ReviewModal from '../components/ReviewModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const [myBookings, setMyBookings] = useState([]);
  const [incomingBookings, setIncomingBookings] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [myBRes, incBRes, skillsRes] = await Promise.all([
        bookingService.getMyBookings(),
        bookingService.getIncomingBookings().catch(() => ({ data: [] })),
        user ? skillService.getSkills({ mentor: user._id || user.id }).catch(() => ({ data: { skills: [] } })) : Promise.resolve({ data: { skills: [] } }),
      ]);

      const myB = myBRes.data?.bookings || myBRes.data || [];
      const incB = incBRes.data?.bookings || incBRes.data || [];
      const skills = skillsRes.data?.skills || skillsRes.data || [];

      setMyBookings(myB);
      setIncomingBookings(incB);
      setMySkills(skills);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleAccept = async (id) => {
    try {
      await bookingService.updateStatus(id, 'accepted');
      toast.success('Session accepted!');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to accept session');
    }
  };

  const handleReject = async (id) => {
    try {
      await bookingService.updateStatus(id, 'rejected');
      toast.success('Session rejected');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to reject session');
    }
  };

  const handleCancel = async (id) => {
    try {
      await bookingService.updateStatus(id, 'cancelled');
      toast.success('Booking cancelled');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to cancel session');
    }
  };

  const handleComplete = async (id) => {
    try {
      await bookingService.updateStatus(id, 'completed');
      toast.success('Session completed!');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to mark completed');
    }
  };

  // Calculations for metrics
  const upcomingBookings = myBookings.filter((b) => ['pending', 'accepted'].includes(b.status));
  const completedLearnerSessions = myBookings.filter((b) => b.status === 'completed');
  const completedTotalCount =
    myBookings.filter((b) => b.status === 'completed').length +
    incomingBookings.filter((b) => b.status === 'completed').length;

  const pendingIncoming = incomingBookings.filter((b) => b.status === 'pending');

  const totalEarnings = incomingBookings
    .filter((b) => b.status === 'completed')
    .reduce((acc, b) => acc + (b.totalAmount !== undefined ? b.totalAmount : (b.hourlyRate || b.price || 0)), 0);

  const isTeacherOrMentor =
    user?.role === 'mentor' || mySkills.length > 0 || (user?.skillsOffered && user.skillsOffered.length > 0);

  return (
    <div className="dashboard-page page">
      <div className="container">
        {/* Welcome Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Dashboard
            </h1>
            <p className="dashboard-subtitle">
              Welcome back, {user?.name}. Here is an overview of your sessions, requests, and listings.
            </p>
          </div>

          <div className="dashboard-actions">
            {isTeacherOrMentor && (
              <Link to="/skills/create" className="btn btn--primary">
                <PlusCircle size={16} /> Create Skill
              </Link>
            )}
            <Link to="/explore" className="btn btn--outline">
              <BookOpen size={16} /> Explore Skills
            </Link>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="dashboard-metrics">
          <div className="metric-card card">
            <div className="metric-card__icon" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <Calendar size={20} />
            </div>
            <div className="metric-card__data">
              <span className="metric-card__label">Upcoming Bookings</span>
              <span className="metric-card__value">{upcomingBookings.length}</span>
            </div>
          </div>

          <div className="metric-card card">
            <div className="metric-card__icon" style={{ backgroundColor: '#EFF4FF', color: '#2563EB' }}>
              <CheckCircle2 size={20} />
            </div>
            <div className="metric-card__data">
              <span className="metric-card__label">Completed Sessions</span>
              <span className="metric-card__value">{completedTotalCount}</span>
            </div>
          </div>

          {isTeacherOrMentor && (
            <>
              <Link to="/my-skills" className="metric-card card" style={{ textDecoration: 'none' }}>
                <div className="metric-card__icon" style={{ backgroundColor: '#F3E8FF', color: '#7E22CE' }}>
                  <BookOpen size={20} />
                </div>
                <div className="metric-card__data">
                  <span className="metric-card__label">Skills Offered</span>
                  <span className="metric-card__value">{mySkills.length}</span>
                </div>
              </Link>

              <Link to="/reviews" className="metric-card card" style={{ textDecoration: 'none' }}>
                <div className="metric-card__icon" style={{ backgroundColor: '#FEF9C3', color: '#CA8A04' }}>
                  <Star size={20} />
                </div>
                <div className="metric-card__data">
                  <span className="metric-card__label">Reviews Received</span>
                  <span className="metric-card__value">
                    {user?.totalReviews || 0} {user?.averageRating ? `(${user.averageRating}★)` : ''}
                  </span>
                </div>
              </Link>

              <div className="metric-card card">
                <div className="metric-card__icon" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
                  <Clock size={20} />
                </div>
                <div className="metric-card__data">
                  <span className="metric-card__label">Pending Requests</span>
                  <span className="metric-card__value">{pendingIncoming.length}</span>
                </div>
              </div>

              <div className="metric-card card">
                <div className="metric-card__icon" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
                  <DollarSign size={20} />
                </div>
                <div className="metric-card__data">
                  <span className="metric-card__label">Total Earnings</span>
                  <span className="metric-card__value">${totalEarnings}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pending Requests for Mentors */}
        {isTeacherOrMentor && pendingIncoming.length > 0 && (
          <section className="dashboard-section">
            <div className="dashboard-section__header">
              <h2 className="dashboard-section__title">
                Action Required: Pending Requests ({pendingIncoming.length})
              </h2>
            </div>
            <div className="dashboard-bookings-grid">
              {pendingIncoming.map((b) => (
                <BookingCard
                  key={b._id || b.id}
                  booking={b}
                  isMentor={true}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming / Active Bookings */}
        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <h2 className="dashboard-section__title">Upcoming Sessions</h2>
            <Link to="/bookings" className="dashboard-section__link">
              View all bookings <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={3} type="card" />
          ) : upcomingBookings.length > 0 ? (
            <div className="dashboard-bookings-grid">
              {upcomingBookings.slice(0, 3).map((b) => (
                <BookingCard
                  key={b._id || b.id}
                  booking={b}
                  isMentor={false}
                  onCancel={handleCancel}
                  onComplete={handleComplete}
                  onReview={(booking) => setSelectedBookingForReview(booking)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming sessions"
              description="You haven't booked any upcoming learning sessions. Find a mentor and book your next session!"
              actionLabel="Explore Skills"
              actionLink="/explore"
            />
          )}
        </section>

        {/* Completed Sessions */}
        {completedLearnerSessions.length > 0 && (
          <section className="dashboard-section">
            <div className="dashboard-section__header">
              <h2 className="dashboard-section__title">Completed Sessions ({completedLearnerSessions.length})</h2>
              <Link to="/bookings" className="dashboard-section__link">
                View in bookings <ArrowRight size={16} />
              </Link>
            </div>

            <div className="dashboard-bookings-grid">
              {completedLearnerSessions.slice(0, 3).map((b) => (
                <BookingCard
                  key={b._id || b.id}
                  booking={b}
                  isMentor={false}
                  onReview={(booking) => setSelectedBookingForReview(booking)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Mentor's Skills Section */}
        {(user?.role === 'mentor' || mySkills.length > 0) && (
          <section className="dashboard-section">
            <div className="dashboard-section__header">
              <h2 className="dashboard-section__title">Skills Offered ({mySkills.length})</h2>
              <Link to="/my-skills" className="dashboard-section__link">
                Manage skills <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton count={3} type="card" />
            ) : mySkills.length > 0 ? (
              <div className="dashboard-skills-grid">
                {mySkills.slice(0, 3).map((skill) => (
                  <SkillCard key={skill._id || skill.id} skill={skill} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="No skills listed yet"
                description="Share what you know! Create your first skill to start mentoring peers."
                actionLabel="Create a Skill"
                actionLink="/skills/create"
              />
            )}
          </section>
        )}

        {/* Review Modal */}
        <ReviewModal
          isOpen={!!selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          booking={selectedBookingForReview}
          onSuccess={() => {
            fetchDashboardData();
            toast.success('Review published!');
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
