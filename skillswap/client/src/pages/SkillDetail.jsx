import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  Share2,
  ArrowLeft,
  Edit,
  ShieldCheck,
} from 'lucide-react';
import { skillService } from '../services/skillService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';
import RatingStars from '../components/RatingStars';
import ReviewCard from '../components/ReviewCard';
import BookingModal from '../components/BookingModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import './SkillDetail.css';

const SkillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [skill, setSkill] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchSkillData = async () => {
      try {
        setLoading(true);
        const res = await skillService.getSkillById(id);
        const skillData = res.data.skill || res.data;
        setSkill(skillData);

        // Fetch reviews for mentor
        const mentorId = skillData.mentor?._id || skillData.mentor?.id || skillData.mentor;
        if (mentorId) {
          try {
            const revRes = await reviewService.getMentorReviews(mentorId);
            setReviews(revRes.data.reviews || revRes.data || []);
          } catch (e) {
            console.error('Failed to load reviews', e);
          }
        }
      } catch (err) {
        toast.error('Skill not found or failed to load');
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };

    fetchSkillData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container page">
        <LoadingSkeleton count={1} type="profile" />
      </div>
    );
  }

  if (!skill) return null;

  const mentor = skill.mentor || {};
  const isOwner = user && (user._id === mentor._id || user.id === mentor._id || user._id === mentor);
  const price = skill.hourlyRate !== undefined ? skill.hourlyRate : (skill.price || 0);
  const title = skill.name || skill.title || 'Skill Details';
  const level = skill.experienceLevel || skill.level || 'All Levels';
  const rating = skill.averageRating !== undefined ? skill.averageRating : (skill.rating || mentor.averageRating || mentor.rating || 0);
  const reviewCount = skill.totalReviews !== undefined ? skill.totalReviews : (skill.reviewCount || mentor.totalReviews || mentor.reviewCount || 0);
  const isFree = !price || price === 0;

  const handleBookClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/skills/${id}` } } });
      return;
    }
    setIsBookingOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Skill link copied to clipboard!');
    }
  };

  return (
    <div className="skill-detail-page page">
      <div className="container">
        {/* Breadcrumb / Back Link */}
        <div className="skill-detail__back">
          <Link to="/explore" className="btn btn--ghost btn--sm">
            <ArrowLeft size={16} /> Back to Explore
          </Link>
        </div>

        <div className="skill-detail__layout">
          {/* Main Content */}
          <div className="skill-detail__main">
            {/* Header info */}
            <div className="skill-detail__header">
              <div className="skill-detail__tags">
                <StatusBadge status={skill.category} type="category" />
                <StatusBadge status={level} type="level" />
              </div>

              <h1 className="skill-detail__title">{title}</h1>

              <div className="skill-detail__meta">
                <Link to={`/mentor/${mentor._id || mentor.id}`} className="skill-detail__mentor-mini">
                  <Avatar src={mentor.avatar} name={mentor.name} size="sm" />
                  <span>Hosted by <strong>{mentor.name}</strong></span>
                </Link>

                <div className="skill-detail__rating-mini">
                  <RatingStars rating={rating} size={16} showValue count={reviewCount} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="skill-detail__section card">
              <h2 className="skill-detail__section-title">About this Session</h2>
              <div className="skill-detail__description">
                <p>{skill.description}</p>
              </div>

              {skill.tags && skill.tags.length > 0 && (
                <div className="skill-detail__tags-list">
                  {skill.tags.map((tag, idx) => (
                    <span key={idx} className="skill-detail__tag-item">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Mentor Details Box */}
            <div className="skill-detail__section card">
              <h2 className="skill-detail__section-title">About the Mentor</h2>
              <div className="skill-detail__mentor-card">
                <Avatar src={mentor.avatar} name={mentor.name} size="xl" />
                <div className="skill-detail__mentor-bio">
                  <h3 className="skill-detail__mentor-name">{mentor.name}</h3>
                  <p className="skill-detail__mentor-headline">{mentor.title || 'Peer Instructor'}</p>
                  <p className="skill-detail__mentor-desc">{mentor.bio || 'Passionate about sharing knowledge and coaching peers.'}</p>
                  <Link to={`/mentor/${mentor._id || mentor.id}`} className="btn btn--outline btn--sm mt-3">
                    View Complete Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="skill-detail__section card">
              <div className="skill-detail__section-header">
                <h2 className="skill-detail__section-title">Learner Reviews</h2>
                <span className="text-secondary text-sm">
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {reviews.length > 0 ? (
                <div className="skill-detail__reviews-list">
                  {reviews.map((rev) => (
                    <ReviewCard key={rev._id || rev.id} review={rev} />
                  ))}
                </div>
              ) : (
                <p className="text-secondary" style={{ fontStyle: 'italic' }}>
                  No reviews yet for this mentor. Be the first to book a session and leave your feedback!
                </p>
              )}
            </div>
          </div>

          {/* Sticky Booking Sidebar */}
          <aside className="skill-detail__sidebar">
            <div className="skill-detail__book-card card">
              <div className="skill-detail__book-price">
                {isFree ? (
                  <span className="skill-detail__free-badge">Free</span>
                ) : (
                  <>
                    <span className="skill-detail__price-val">${price}</span>
                    <span className="skill-detail__price-unit">/ hr</span>
                  </>
                )}
              </div>

              <div className="skill-detail__features">
                <div className="skill-detail__feature-item">
                  <Clock size={16} />
                  <span>{skill.duration || 60} Minutes 1-on-1</span>
                </div>
                <div className="skill-detail__feature-item">
                  <Calendar size={16} />
                  <span>{skill.availability ? `Schedule: ${skill.availability}` : 'Online 1-on-1 video session'}</span>
                </div>
                <div className="skill-detail__feature-item">
                  <ShieldCheck size={16} />
                  <span>Verified mentor credentials</span>
                </div>
              </div>

              {isOwner ? (
                <Link to={`/skills/${id}/edit`} className="btn btn--outline btn--full">
                  <Edit size={16} /> Edit My Skill
                </Link>
              ) : (
                <button
                  onClick={handleBookClick}
                  className="btn btn--primary btn--full btn--lg"
                >
                  Book Session
                </button>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="btn btn--ghost btn--full btn--sm mt-2"
              >
                <Share2 size={14} /> Share this Skill
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        skill={skill}
        onSuccess={() => {
          navigate('/bookings');
        }}
      />
    </div>
  );
};

export default SkillDetail;
