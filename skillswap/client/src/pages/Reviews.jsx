import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reviewService } from '../services/reviewService';
import ReviewCard from '../components/ReviewCard';
import RatingStars from '../components/RatingStars';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        if (user?.role === 'mentor') {
          const res = await reviewService.getMentorReviews(user._id || user.id);
          setReviews(res.data.reviews || res.data || []);
        } else {
          const res = await reviewService.getMyReviews();
          setReviews(res.data.reviews || res.data || []);
        }
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReviews();
    }
  }, [user]);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <div className="reviews-page page">
      <div className="container container--narrow">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-1)' }}>
            {user?.role === 'mentor' ? 'Mentorship Reviews' : 'My Session Reviews'}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            {user?.role === 'mentor'
              ? 'Feedback submitted by peers who learned with you'
              : 'Ratings and reviews you submitted for your past mentors'}
          </p>
        </div>

        {/* Rating summary card for mentors */}
        {user?.role === 'mentor' && reviews.length > 0 && (
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-8)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1 }}>
                {averageRating}
              </div>
              <div style={{ marginTop: 'var(--space-2)' }}>
                <RatingStars rating={Number(averageRating)} size={18} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600' }}>
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                100% verified learners
              </span>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {loading ? (
          <LoadingSkeleton count={3} type="list" />
        ) : reviews.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {reviews.map((rev) => (
              <ReviewCard key={rev._id || rev.id} review={rev} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No reviews yet"
            description={
              user?.role === 'mentor'
                ? "You haven't received any reviews yet. Complete bookings to collect feedback from learners."
                : "You haven't submitted any reviews yet. Complete a session with a mentor to leave feedback."
            }
          />
        )}
      </div>
    </div>
  );
};

export default Reviews;
