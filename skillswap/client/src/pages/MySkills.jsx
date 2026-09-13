import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, ExternalLink, Clock, DollarSign } from 'lucide-react';
import { skillService } from '../services/skillService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const MySkills = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMySkills = async () => {
    try {
      setLoading(true);
      const res = await skillService.getSkills({ mentor: user?._id || user?.id });
      setSkills(res.data.skills || res.data || []);
    } catch (err) {
      console.error('Failed to load my skills', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMySkills();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill listing?')) {
      return;
    }

    try {
      await skillService.deleteSkill(id);
      toast.success('Skill deleted successfully');
      setSkills(skills.filter((s) => (s._id || s.id) !== id));
    } catch (err) {
      toast.error('Failed to delete skill');
    }
  };

  return (
    <div className="my-skills-page page">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-1)' }}>
              My Offered Skills
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Manage your skill listings, pricing, and availability for sessions
            </p>
          </div>

          <Link to="/skills/create" className="btn btn--primary">
            <PlusCircle size={16} /> Create Skill
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} type="list" />
        ) : skills.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {skills.map((skill) => {
              const id = skill._id || skill.id;
              return (
                <div
                  key={id}
                  className="card card--hoverable"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-5) var(--space-6)',
                    flexWrap: 'wrap',
                    gap: 'var(--space-4)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                      <StatusBadge status={skill.category} type="category" />
                      <StatusBadge status={skill.level} type="level" />
                    </div>
                    <h3 style={{ fontSize: 'var(--font-size-md)', margin: 0 }}>
                      <Link to={`/skills/${id}`} style={{ color: 'var(--color-text)' }}>
                        {skill.title}
                      </Link>
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {skill.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={15} />
                      <span>{skill.duration || 60}m</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontWeight: '600', color: 'var(--color-text)' }}>
                      {skill.price > 0 ? `$${skill.price}` : 'Free'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Link
                      to={`/skills/${id}`}
                      className="btn btn--ghost btn--sm"
                      title="View public skill page"
                    >
                      <ExternalLink size={15} /> View
                    </Link>
                    <Link
                      to={`/skills/${id}/edit`}
                      className="btn btn--outline btn--sm"
                      title="Edit skill details"
                    >
                      <Edit size={15} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(id)}
                      className="btn btn--danger btn--sm"
                      title="Delete skill"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No skills listed yet"
            description="You haven't added any skills to offer. List your first skill to start receiving booking requests!"
            actionLabel="Create Skill"
            actionLink="/skills/create"
          />
        )}
      </div>
    </div>
  );
};

export default MySkills;
