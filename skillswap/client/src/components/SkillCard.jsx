import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign } from 'lucide-react';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import RatingStars from './RatingStars';
import './SkillCard.css';

const SkillCard = ({ skill }) => {
  if (!skill) return null;

  const mentor = skill.mentor || {};
  const price = skill.hourlyRate !== undefined ? skill.hourlyRate : (skill.price || 0);
  const title = skill.name || skill.title || 'Untitled Skill';
  const level = skill.experienceLevel || skill.level || 'All Levels';
  const rating = skill.averageRating !== undefined ? skill.averageRating : (skill.rating || mentor.averageRating || mentor.rating || 0);
  const reviewCount = skill.totalReviews !== undefined ? skill.totalReviews : (skill.reviewCount || mentor.totalReviews || mentor.reviewCount || 0);
  const isFree = !price || price === 0;

  return (
    <div className="skill-card card card--hoverable">
      <div className="skill-card__header">
        <Link to={`/mentor/${mentor._id || mentor.id}`} className="skill-card__mentor-link">
          <Avatar src={mentor.avatar} name={mentor.name} size="md" />
          <div className="skill-card__mentor-info">
            <span className="skill-card__mentor-name">{mentor.name || 'Anonymous Mentor'}</span>
            <span className="skill-card__mentor-title">{mentor.title || mentor.location || 'Instructor'}</span>
          </div>
        </Link>
        <StatusBadge status={level} type="level" />
      </div>

      <div className="skill-card__body">
        <div className="skill-card__category">
          <StatusBadge status={skill.category} type="category" />
        </div>
        <h3 className="skill-card__title">
          <Link to={`/skills/${skill._id || skill.id}`}>{title}</Link>
        </h3>
        <p className="skill-card__desc">{skill.description}</p>
      </div>

      <div className="skill-card__meta">
        <div className="skill-card__meta-item">
          <Clock size={14} />
          <span>{skill.duration || 60} mins</span>
        </div>
        <div className="skill-card__meta-item">
          <RatingStars
            rating={rating}
            size={14}
            showValue
            count={reviewCount}
          />
        </div>
      </div>

      <div className="skill-card__footer">
        <div className="skill-card__price">
          {isFree ? (
            <span className="skill-card__free">Free</span>
          ) : (
            <>
              <span className="skill-card__amount">${price}</span>
              <span className="skill-card__per-session">/hr</span>
            </>
          )}
        </div>
        <Link to={`/skills/${skill._id || skill.id}`} className="btn btn--primary btn--sm">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default SkillCard;
