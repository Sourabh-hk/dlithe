import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SkillContext } from '../context/SkillContext';
import SkillCard from '../components/SkillCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { ArrowRight, Search, Users, Star } from 'lucide-react';

const CATEGORIES = [
  'Web Development', 'Mobile Development', 'Graphic Design', 
  'Photography', 'Music', 'Languages', 'Digital Marketing', 
  'Data Science', 'Fitness', 'Cooking'
];

const Home = () => {
  const { skills, loading, error, fetchSkills } = useContext(SkillContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleCategoryClick = (category) => {
    navigate(`/skills?category=${encodeURIComponent(category)}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: '4rem 1rem', 
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        borderRadius: 'var(--radius)',
        marginBottom: '3rem'
      }}>
        <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '1.5rem' }}>
          Share What You Know. Learn What You Love.
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem auto', opacity: 0.9 }}>
          Join our community platform to exchange skills, discover new talents, and connect with passionate learners and teachers around the world.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/skills" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary-color)' }}>
            Explore Skills
          </Link>
          <Link to="/add-skill" className="btn" style={{ border: '1px solid white', color: 'white' }}>
            Offer a Skill
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 className="text-center" style={{ marginBottom: '2rem' }}>How It Works</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Star color="var(--primary-color)" />
            </div>
            <h3>1. Create Your Listing</h3>
            <p className="text-light">Offer a skill you excel at. Set your experience level and availability.</p>
          </div>
          <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Search color="var(--primary-color)" />
            </div>
            <h3>2. Discover Skills</h3>
            <p className="text-light">Browse through hundreds of skills offered by other passionate individuals.</p>
          </div>
          <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Users color="var(--primary-color)" />
            </div>
            <h3>3. Connect & Learn</h3>
            <p className="text-light">Reach out, arrange a meeting, and start exchanging valuable knowledge.</p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Popular Categories</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {CATEGORIES.map((category) => (
            <button 
              key={category} 
              onClick={() => handleCategoryClick(category)}
              className="btn btn-secondary"
              style={{ borderRadius: '2rem' }}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Skills */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Featured Skills</h2>
          <Link to="/skills" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '500' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        {loading && <Loading />}
        {error && <ErrorMessage message={error} onRetry={() => fetchSkills()} />}
        
        {!loading && !error && (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {skills.slice(0, 3).map(skill => (
              <SkillCard key={skill._id} skill={skill} />
            ))}
            {skills.length === 0 && (
              <p className="text-light">No skills available yet. Be the first to add one!</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
