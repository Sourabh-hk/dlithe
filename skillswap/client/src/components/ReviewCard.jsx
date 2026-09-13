import React from 'react';
import Avatar from './Avatar';
import RatingStars from './RatingStars';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  if (!review) return null;

  const reviewer = review.learner || review.reviewer || {};
  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
  const skillTitle = review.skill?.name || review.skill?.title || review.booking?.skill?.name;

  return (
    <div className="review-card card">
      <div className="review-card__header">
        <div className="review-card__author">
          <Avatar src={reviewer.avatar} name={reviewer.name} size="sm" />
          <div>
            <h4 className="review-card__author-name">{reviewer.name || 'Anonymous User'}</h4>
            {formattedDate && <span className="review-card__date">{formattedDate}</span>}
          </div>
        </div>
        <RatingStars rating={review.rating} size={15} />
      </div>

      {skillTitle && (
        <div className="review-card__skill">
          <span>Session: {skillTitle}</span>
        </div>
      )}

      <p className="review-card__comment">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
