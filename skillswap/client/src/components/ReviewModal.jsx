import React, { useState } from 'react';
import Modal from './Modal';
import RatingStars from './RatingStars';
import { reviewService } from '../services/reviewService';
import toast from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, booking, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a brief comment');
      return;
    }

    try {
      setLoading(true);
      await reviewService.createReview({
        bookingId: booking._id || booking.id,
        mentorId: booking.mentor?._id || booking.mentor?.id || booking.mentor,
        skillId: booking.skill?._id || booking.skill?.id || booking.skill,
        rating,
        comment: comment.trim(),
      });
      toast.success('Thank you for your review!');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
          <h4 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--font-size-md)' }}>
            {booking.skill?.title || 'Learning Session'}
          </h4>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Mentor: <strong>{booking.mentor?.name || 'Mentor'}</strong>
          </p>
        </div>

        <div className="form-group" style={{ textAlign: 'center' }}>
          <label className="form-label" style={{ marginBottom: 'var(--space-3)' }}>
            Your Overall Rating
          </label>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>
            <RatingStars
              rating={rating}
              interactive
              onChange={setRating}
              size={32}
            />
          </div>
          <p className="form-hint">{rating} out of 5 stars</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="review-comment">
            Feedback & Comments *
          </label>
          <textarea
            id="review-comment"
            className="form-textarea"
            rows="4"
            placeholder="How was your session? What did you learn and how was the mentor's guidance?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-6)' }}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Submit Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;
