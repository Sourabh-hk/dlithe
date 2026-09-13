import React from 'react';
import { Calendar, Clock, DollarSign, MessageSquare, Check, X, CheckCircle, Star } from 'lucide-react';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import './BookingCard.css';

const BookingCard = ({
  booking,
  isMentor = false,
  onAccept,
  onReject,
  onCancel,
  onComplete,
  onReview,
}) => {
  if (!booking) return null;

  const otherUser = isMentor ? booking.learner : booking.mentor;
  const cost = booking.totalAmount !== undefined ? booking.totalAmount : (booking.hourlyRate !== undefined ? booking.hourlyRate : (booking.price || 0));
  const isFree = !cost || cost === 0;
  const timeDisplay = booking.timeSlot || (booking.startTime && booking.endTime ? `${booking.startTime} - ${booking.endTime}` : (booking.startTime || 'Flexible time'));
  const skillTitle = booking.skill?.name || booking.skill?.title || 'Learning Session';
  const notes = booking.meetingNotes || booking.message;

  const formattedDate = booking.date
    ? new Date(booking.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date not set';

  return (
    <div className="booking-card card">
      <div className="booking-card__top">
        <div className="booking-card__user">
          <Avatar src={otherUser?.avatar} name={otherUser?.name} size="md" />
          <div>
            <span className="booking-card__user-role">
              {isMentor ? 'Learner' : 'Mentor'}
            </span>
            <h4 className="booking-card__user-name">{otherUser?.name || 'User'}</h4>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="booking-card__skill">
        <h3 className="booking-card__skill-title">
          {skillTitle}
        </h3>
        {booking.skill?.category && (
          <span className="badge badge--category" style={{ alignSelf: 'flex-start' }}>
            {booking.skill.category}
          </span>
        )}
      </div>

      <div className="booking-card__schedule">
        <div className="booking-card__info-row">
          <Calendar size={15} />
          <span>{formattedDate}</span>
        </div>
        <div className="booking-card__info-row">
          <Clock size={15} />
          <span>{timeDisplay}</span>
        </div>
        <div className="booking-card__info-row">
          <DollarSign size={15} />
          <span>{isFree ? 'Free' : `$${cost}`}</span>
        </div>
      </div>

      {notes && (
        <div className="booking-card__message">
          <MessageSquare size={14} className="booking-card__message-icon" />
          <p>{notes}</p>
        </div>
      )}

      <div className="booking-card__actions">
        {/* If incoming (mentor) and pending */}
        {isMentor && booking.status === 'pending' && (
          <>
            <button
              onClick={() => onAccept && onAccept(booking._id || booking.id)}
              className="btn btn--primary btn--sm"
            >
              <Check size={14} /> Accept
            </button>
            <button
              onClick={() => onReject && onReject(booking._id || booking.id)}
              className="btn btn--danger btn--sm"
            >
              <X size={14} /> Reject
            </button>
          </>
        )}

        {/* If outgoing (learner) and pending */}
        {!isMentor && booking.status === 'pending' && (
          <button
            onClick={() => onCancel && onCancel(booking._id || booking.id)}
            className="btn btn--danger btn--sm"
          >
            Cancel Request
          </button>
        )}

        {/* If accepted */}
        {booking.status === 'accepted' && (
          <button
            onClick={() => onComplete && onComplete(booking._id || booking.id)}
            className="btn btn--outline btn--sm"
          >
            <CheckCircle size={14} /> Mark Completed
          </button>
        )}

        {/* If completed and learner can review */}
        {!isMentor && booking.status === 'completed' && !booking.reviewed && (
          <button
            onClick={() => onReview && onReview(booking)}
            className="btn btn--primary btn--sm"
          >
            <Star size={14} /> Leave Review
          </button>
        )}

        {!isMentor && booking.status === 'completed' && booking.reviewed && (
          <span className="text-sm text-secondary" style={{ fontStyle: 'italic' }}>
            Reviewed ✓
          </span>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
