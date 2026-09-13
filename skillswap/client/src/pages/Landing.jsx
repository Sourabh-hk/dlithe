import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Code2,
  Palette,
  Globe2,
  Music2,
  TrendingUp,
  PenTool,
  Camera,
  Layers,
  CalendarCheck2,
  MessageSquareQuote,
  ShieldCheck,
} from 'lucide-react';
import { skillService } from '../services/skillService';
import SkillCard from '../components/SkillCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import './Landing.css';

const CATEGORIES = [
  { name: 'Web Development', icon: Code2, count: 'React, Node, Fullstack' },
  { name: 'Programming', icon: Layers, count: 'Python, DSA, Go' },
  { name: 'Design', icon: Palette, count: 'Figma, UI/UX Systems' },
  { name: 'Data Science', icon: TrendingUp, count: 'ML, Pandas, Analytics' },
  { name: 'Languages', icon: Globe2, count: 'Conversational Fluency' },
  { name: 'Career', icon: CalendarCheck2, count: 'Mock Interviews, Resume' },
  { name: 'Photography', icon: Camera, count: 'Camera, Lightroom' },
  { name: 'Music', icon: Music2, count: 'Guitar, Music Theory' },
];

const Landing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredSkills, setFeaturedSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await skillService.getSkills({ limit: 6, sort: '-averageRating' });
        setFeaturedSkills(res.data.skills || res.data || []);
      } catch (err) {
        console.error('Failed to load featured skills', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="landing-page">
      {/* Editorial Hero Header */}
      <section className="landing-hero">
        <div className="container landing-hero__container">
          <div className="landing-hero__tag">Peer Learning Marketplace</div>
          <h1 className="landing-hero__title">
            1-on-1 mentorship from engineers, designers, and domain specialists.
          </h1>
          <p className="landing-hero__subtitle">
            Book focused, private sessions for technical guidance, portfolio feedback, or hands-on practice. Direct knowledge sharing between verified practitioners.
          </p>

          <form className="landing-hero__search" onSubmit={handleSearch}>
            <Search className="landing-hero__search-icon" size={18} />
            <input
              type="text"
              className="landing-hero__search-input"
              placeholder="Search by topic, framework, or skill (e.g., React, System Design, Figma)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn--primary">
              Find a Mentor
            </button>
          </form>

          <div className="landing-hero__trust">
            <div className="landing-hero__trust-item">
              <ShieldCheck size={16} /> Verified Practitioner Profiles
            </div>
            <span className="landing-hero__trust-dot">•</span>
            <div className="landing-hero__trust-item">
              <CalendarCheck2 size={16} /> Direct Schedule Booking
            </div>
            <span className="landing-hero__trust-dot">•</span>
            <div className="landing-hero__trust-item">
              <MessageSquareQuote size={16} /> Authentic Student Reviews
            </div>
          </div>
        </div>
      </section>

      {/* Structured Category Strip */}
      <section className="landing-categories">
        <div className="container">
          <div className="landing-section-header">
            <div>
              <h2 className="landing-section-title">Explore by Domain</h2>
              <p className="landing-section-desc">Browse structured disciplines and practical curricula</p>
            </div>
            <Link to="/explore" className="landing-section-link">
              View all listings <ArrowRight size={14} />
            </Link>
          </div>

          <div className="landing-categories__grid">
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/explore?category=${encodeURIComponent(cat.name)}`}
                  className="category-tile"
                >
                  <div className="category-tile__icon">
                    <Icon size={18} />
                  </div>
                  <div className="category-tile__info">
                    <div className="category-tile__name">{cat.name}</div>
                    <div className="category-tile__count">{cat.count}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Skills / Sessions */}
      <section className="landing-featured">
        <div className="container">
          <div className="landing-section-header">
            <div>
              <h2 className="landing-section-title">Available Mentorship Sessions</h2>
              <p className="landing-section-desc">Recent and top-rated sessions available for booking</p>
            </div>
            <Link to="/explore" className="landing-section-link">
              Explore catalog <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={6} type="card" />
          ) : featuredSkills.length > 0 ? (
            <div className="landing-skills-grid">
              {featuredSkills.map((skill) => (
                <SkillCard key={skill._id || skill.id} skill={skill} />
              ))}
            </div>
          ) : (
            <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
              <p>No listings currently available. Check back shortly!</p>
              <Link to="/explore" className="btn btn--outline mt-3">
                Explore All
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Practical How it Works Section (Ground-truth and operational) */}
      <section className="landing-workflow">
        <div className="container">
          <div className="landing-section-header" style={{ marginBottom: 'var(--space-6)' }}>
            <div>
              <h2 className="landing-section-title">How Sessions Work</h2>
              <p className="landing-section-desc">Straightforward, asynchronous scheduling with no subscriptions required</p>
            </div>
          </div>

          <div className="workflow-grid">
            <div className="workflow-card">
              <div className="workflow-card__step">01</div>
              <h3 className="workflow-card__title">Choose a mentor & curriculum</h3>
              <p className="workflow-card__desc">
                Review verified experience, rate per hour, and past student feedback. Find mentors who specialize in your exact challenge.
              </p>
            </div>

            <div className="workflow-card">
              <div className="workflow-card__step">02</div>
              <h3 className="workflow-card__title">Propose date and objectives</h3>
              <p className="workflow-card__desc">
                Select an open time slot and include specific questions or repository links. Mentors review and confirm availability.
              </p>
            </div>

            <div className="workflow-card">
              <div className="workflow-card__step">03</div>
              <h3 className="workflow-card__title">Meet, learn, and review</h3>
              <p className="workflow-card__desc">
                Conduct the 1-on-1 live session. Once marked complete, leave an honest evaluation to assist other learners in the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grounded CTA Banner */}
      <section className="landing-cta">
        <div className="container">
          <div className="landing-cta__box">
            <div className="landing-cta__content">
              <h2 className="landing-cta__title">Have skills to share?</h2>
              <p className="landing-cta__desc">
                Join our practitioner directory. Offer 1-on-1 sessions, set your own rates and schedule, and build your mentoring track record.
              </p>
            </div>
            <div className="landing-cta__actions">
              <Link to="/register" className="btn btn--primary">
                Create Mentor Profile
              </Link>
              <Link to="/explore" className="btn btn--outline">
                Browse Directory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
