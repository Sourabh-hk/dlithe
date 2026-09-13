import React from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Mail, MapPin, Globe, Calendar, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import RatingStars from '../components/RatingStars';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-page page">
      <div className="container container--narrow">
        <div className="profile-card card">
          <div className="profile-card__header">
            <div className="profile-card__user">
              <Avatar src={user.avatar} name={user.name} size="xl" />
              <div className="profile-card__info">
                <div className="profile-card__name-badge">
                  <h1 className="profile-card__name">{user.name}</h1>
                  <span className="badge badge--category" style={{ textTransform: 'uppercase' }}>
                    {user.role}
                  </span>
                </div>
                <p className="profile-card__title">{user.title || 'SkillSwap Member'}</p>
                {user.role === 'mentor' && (
                  <div className="profile-card__rating">
                    <RatingStars
                      rating={user.averageRating !== undefined ? user.averageRating : (user.rating || 0)}
                      size={16}
                      showValue
                      count={user.totalReviews !== undefined ? user.totalReviews : (user.reviewCount || 0)}
                    />
                  </div>
                )}
              </div>
            </div>

            <Link to="/profile/edit" className="btn btn--outline btn--sm">
              <Edit3 size={15} /> Edit Profile
            </Link>
          </div>

          <div className="profile-card__body">
            {user.bio ? (
              <div className="profile-card__bio-section">
                <h3 className="profile-card__section-label">About Me</h3>
                <p className="profile-card__bio">{user.bio}</p>
              </div>
            ) : (
              <div className="profile-card__bio-section">
                <p className="text-tertiary" style={{ fontStyle: 'italic' }}>
                  No bio added yet. Tell others about your background and interests!
                </p>
              </div>
            )}

            {/* Skills wanted to learn */}
            {(user.learningInterests || user.skillsWanted) && (user.learningInterests || user.skillsWanted).length > 0 && (
              <div className="profile-card__section">
                <h3 className="profile-card__section-label">Learning Interests</h3>
                <div className="profile-card__tags">
                  {(user.learningInterests || user.skillsWanted).map((sk, idx) => (
                    <span key={idx} className="badge badge--category">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills offered */}
            {user.skillsOffered && user.skillsOffered.length > 0 && (
              <div className="profile-card__section">
                <h3 className="profile-card__section-label">Skills I Can Teach</h3>
                <div className="profile-card__tags">
                  {user.skillsOffered.map((sk, idx) => (
                    <span key={idx} className="badge badge--level">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="profile-card__contact-meta">
              <div className="profile-card__contact-item">
                <Mail size={15} />
                <span>{user.email}</span>
              </div>
              {user.location && (
                <div className="profile-card__contact-item">
                  <MapPin size={15} />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="profile-card__contact-item">
                  <Globe size={15} />
                  <a href={user.website} target="_blank" rel="noopener noreferrer">
                    {user.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
