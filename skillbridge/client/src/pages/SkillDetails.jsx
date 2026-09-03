import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import skillService from '../services/skillService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { ArrowLeft, Calendar, Clock, Award, Tag } from 'lucide-react';

const SkillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkillDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await skillService.getSkillById(id);
      setSkill(data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch skill details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Loading message="Loading skill details..." />;
  
  if (error) return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back
      </button>
      <ErrorMessage message={error} onRetry={fetchSkillDetails} />
    </div>
  );

  if (!skill) return null;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
          <span style={{ 
            display: 'inline-block', 
            backgroundColor: 'var(--bg-subtle)', 
            color: 'var(--primary-color)', 
            padding: '0.5rem 1rem', 
            borderRadius: '1rem', 
            fontSize: '0.875rem', 
            fontWeight: '500',
            alignSelf: 'flex-start'
          }}>
            {skill.category}
          </span>
          <h1 style={{ margin: 0 }}>{skill.skillName}</h1>
          <p className="text-light" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} /> Listed on {new Date(skill.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          <div>
            <h3>Description</h3>
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
              {skill.description}
            </p>
          </div>

          <div>
            <div className="card" style={{ backgroundColor: 'var(--bg-subtle)', border: 'none' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Skill Details</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Tag color="var(--text-light)" size={20} />
                  <div>
                    <p className="text-light" style={{ margin: 0, fontSize: '0.875rem' }}>Category</p>
                    <p style={{ margin: 0, fontWeight: '500' }}>{skill.category}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Award color="var(--text-light)" size={20} />
                  <div>
                    <p className="text-light" style={{ margin: 0, fontSize: '0.875rem' }}>Experience Level</p>
                    <p style={{ margin: 0, fontWeight: '500' }}>{skill.experienceLevel}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Clock color="var(--text-light)" size={20} />
                  <div>
                    <p className="text-light" style={{ margin: 0, fontSize: '0.875rem' }}>Availability</p>
                    <p style={{ margin: 0, fontWeight: '500' }}>{skill.availability}</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Interested in learning this skill?</h4>
                <button className="btn btn-primary" style={{ width: '100%' }}>Connect with Provider</button>
                <p className="text-light text-center mt-2" style={{ fontSize: '0.75rem', margin: '0.5rem 0 0 0' }}>
                  *Connecting feature coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetails;
