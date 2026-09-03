import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import skillService from '../services/skillService';
import SkillCard from '../components/SkillCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmModal from '../components/ConfirmModal';
import { CheckCircle2 } from 'lucide-react';

const MySkills = () => {
  const location = useLocation();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  const fetchMySkills = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app with auth, we'd fetch only the user's skills
      // For this demo, we'll just fetch all and pretend they belong to the user
      const data = await skillService.getSkills();
      setSkills(data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load your skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySkills();
    
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDeleteModal = (id) => {
    setSkillToDelete(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSkillToDelete(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    
    try {
      await skillService.deleteSkill(skillToDelete);
      setSkills(prev => prev.filter(skill => skill._id !== skillToDelete));
      setSuccessMessage('Skill deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete skill');
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>My Skills</h1>
        <p className="text-light">Manage the skills you are offering to the community.</p>
      </div>

      {successMessage && (
        <div style={{ 
          backgroundColor: 'rgba(16, 185, 129, 0.1)', 
          border: '1px solid rgba(16, 185, 129, 0.2)', 
          color: 'var(--success-color)',
          padding: '1rem', 
          borderRadius: 'var(--radius)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem'
        }}>
          <CheckCircle2 size={20} />
          <span style={{ fontWeight: '500' }}>{successMessage}</span>
        </div>
      )}

      {loading && <Loading message="Loading your skills..." />}
      {error && <ErrorMessage message={error} onRetry={fetchMySkills} />}

      {!loading && !error && (
        <>
          {skills.length > 0 ? (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {skills.map(skill => (
                <SkillCard 
                  key={skill._id} 
                  skill={skill} 
                  showActions={true} 
                  onDelete={openDeleteModal} 
                />
              ))}
            </div>
          ) : (
            <div className="card text-center" style={{ padding: '4rem 2rem' }}>
              <p className="text-light" style={{ fontSize: '1.125rem' }}>You haven't listed any skills yet.</p>
              <button onClick={() => window.location.href = '/add-skill'} className="btn btn-primary mt-4">
                Add Your First Skill
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Skill Listing"
        message="Are you sure you want to delete this skill listing? This action cannot be undone."
      />
    </div>
  );
};

export default MySkills;
