import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Globe, MapPin, Calendar, Star, BookOpen, ArrowLeft } from 'lucide-react';
import { userService } from '../services/userService';
import { skillService } from '../services/skillService';
import { reviewService } from '../services/reviewService';
import Avatar from '../components/Avatar';
import RatingStars from '../components/RatingStars';
import SkillCard from '../components/SkillCard';
import ReviewCard from '../components/ReviewCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import './MentorProfile.css';

const MentorProfile = () => {
  const { id } = useParams();

  const [mentor, setMentor] = useState(null);
  const [skills, setSkills] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        const [mentorRes, skillsRes, revRes] = await Promise.all([
          userService.getUserById(id),
          skillService.getSkills({ mentor: id }),
          reviewService.getMentorReviews(id),
        ]);

        setMentor(mentorRes.data.user || mentorRes.data);
        setSkills(skillsRes.data.skills || skillsRes.data || []);
        setReviews(revRes.data.reviews || revRes.data || []);
      } catch (err) {
        console.error('Failed to load mentor profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [id]);

  if (loading) {
    return (
      <div className="container page">
        <LoadingSkeleton count={1} type="profile" />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="container page">
        <EmptyState
          title="Mentor not found"
          description="The requested mentor profile could not be located."
          actionLabel="Browse Mentors"
          actionLink="/explore"
        />
      </div>
    );
  }

  const joinDate = mentor.createdAt
    ? new Date(mentor.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="mentor-profile-page page">
      <div className="container">
        <div className="mentor-profile__back">
          <Link to="/explore" className="btn btn--ghost btn--sm">
            <ArrowLeft size={16} /> Back to Explore
          </Link>
        </div>

        {/* Mentor Header Card */}
        <div className="mentor-profile__header card">
          <div className="mentor-profile__hero">
            <Avatar src={mentor.avatar} name={mentor.name} size="xl" />

            <div className="mentor-profile__details">
              <div className="mentor-profile__name-row">
                <h1 className="mentor-profile__name">{mentor.name}</h1>
                <span className="badge badge--category" style={{ textTransform: 'uppercase' }}>
                  {mentor.role || 'Mentor'}
                </span>
              </div>

              <p className="mentor-profile__title">{mentor.title || 'Instructor & Consultant'}</p>

              <div className="mentor-profile__rating">
                <RatingStars
                  rating={mentor.averageRating !== undefined ? mentor.averageRating : (mentor.rating || 0)}
                  size={16}
                  showValue
                  count={mentor.totalReviews !== undefined ? mentor.totalReviews : (mentor.reviewCount || reviews.length)}
                />
              </div>

              {mentor.bio && <p className="mentor-profile__bio">{mentor.bio}</p>}

              <div className="mentor-profile__meta">
                {joinDate && (
                  <div className="mentor-profile__meta-item">
                    <Calendar size={14} />
                    <span>Member since {joinDate}</span>
                  </div>
                )}
                {mentor.location && (
                  <div className="mentor-profile__meta-item">
                    <MapPin size={14} />
                    <span>{mentor.location}</span>
                  </div>
                )}
                {mentor.website && (
                  <div className="mentor-profile__meta-item">
                    <Globe size={14} />
                    <a href={mentor.website} target="_blank" rel="noopener noreferrer">
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Offered by Mentor */}
        <section className="mentor-profile__section">
          <div className="mentor-profile__section-header">
            <h2 className="mentor-profile__section-title">
              Skills Offered ({skills.length})
            </h2>
          </div>

          {skills.length > 0 ? (
            <div className="mentor-profile__skills-grid">
              {skills.map((skill) => (
                <SkillCard key={skill._id || skill.id} skill={skill} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No skills listed yet"
              description="This mentor has not published any active skills yet."
            />
          )}
        </section>

        {/* Reviews Section */}
        <section className="mentor-profile__section">
          <div className="mentor-profile__section-header">
            <h2 className="mentor-profile__section-title">
              Reviews & Feedback ({reviews.length})
            </h2>
          </div>

          {reviews.length > 0 ? (
            <div className="mentor-profile__reviews-list">
              {reviews.map((rev) => (
                <ReviewCard key={rev._id || rev.id} review={rev} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Star}
              title="No reviews yet"
              description="This mentor has not received any reviews yet. Be the first to take a session!"
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default MentorProfile;
