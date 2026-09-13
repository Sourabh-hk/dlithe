import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import RatingStars from './RatingStars';
import './MentorCard.css';

const MentorCard = ({ mentor }) => {
  if (!mentor) return null;

  return (
    <div className="mentor-card card card--hoverable">
      <div className="mentor-card__top">
        <Avatar src={mentor.avatar} name={mentor.name} size="lg" />
        <div className="mentor-card__info">
          <h3 className="mentor-card__name">
            <Link to={`/mentor/${mentor._id || mentor.id}`}>{mentor.name}</Link>
          </h3>
          <p className="mentor-card__title">{mentor.title || 'SkillSwap Mentor'}</p>
          <div className="mentor-card__rating">
            <RatingStars rating={mentor.rating || 0} size={14} showValue count={mentor.reviewCount || 0} />
          </div>
        </div>
      </div>

      {mentor.bio && (
        <p className="mentor-card__bio">{mentor.bio}</p>
      )}

      {mentor.skillsOffered && mentor.skillsOffered.length > 0 && (
        <div className="mentor-card__skills">
          {mentor.skillsOffered.slice(0, 3).map((sk, idx) => (
            <span key={idx} className="mentor-card__skill-tag">
              {typeof sk === 'object' ? sk.title : sk}
            </span>
          ))}
          {mentor.skillsOffered.length > 3 && (
            <span className="mentor-card__skill-more">+{mentor.skillsOffered.length - 3} more</span>
          )}
        </div>
      )}

      <div className="mentor-card__footer">
        <Link to={`/mentor/${mentor._id || mentor.id}`} className="btn btn--outline btn--sm btn--full">
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default MentorCard;
