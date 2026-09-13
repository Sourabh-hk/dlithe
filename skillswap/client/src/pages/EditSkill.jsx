import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { skillService } from '../services/skillService';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Web Development',
  'Programming',
  'Data Science',
  'Design',
  'Languages',
  'Career',
  'Photography',
  'Music',
  'Marketing',
  'Business',
  'Other',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const EditSkill = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'Intermediate',
    price: 0,
    availability: '',
    tags: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        setLoading(true);
        const res = await skillService.getSkillById(id);
        const skill = res.data.skill || res.data;
        setFormData({
          title: skill.name || skill.title || '',
          description: skill.description || '',
          category: skill.category || 'Web Development',
          level: skill.experienceLevel || skill.level || 'Intermediate',
          price: skill.hourlyRate !== undefined ? skill.hourlyRate : (skill.price || 0),
          availability: skill.availability || '',
          tags: skill.tags ? skill.tags.join(', ') : '',
        });
      } catch (err) {
        toast.error('Failed to load skill details');
        navigate('/my-skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please provide a title and session description');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.title.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        experienceLevel: formData.level,
        level: formData.level,
        hourlyRate: Number(formData.price) || 0,
        price: Number(formData.price) || 0,
        availability: formData.availability.trim() || 'Flexible schedule',
        tags: formData.tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
      };

      await skillService.updateSkill(id, payload);
      toast.success('Skill updated successfully!');
      navigate(`/skills/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update skill';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container page text-center" style={{ paddingTop: 'var(--space-12)' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="edit-skill-page page">
      <div className="container container--form">
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <Link to="/my-skills" className="btn btn--ghost btn--sm">
            <ArrowLeft size={15} /> Back to My Skills
          </Link>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.25rem' }}>
            Edit Mentorship Listing
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-5)' }}>
            Update your curriculum, availability window, or session rate.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Skill / Session Title *
              </label>
              <input
                id="title"
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Domain / Category *
              </label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="level">
                  Target Proficiency Level
                </label>
                <select
                  id="level"
                  name="level"
                  className="form-select"
                  value={formData.level}
                  onChange={handleChange}
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="price">
                  Rate per Hour ($ USD)
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  min="0"
                  step="1"
                  className="form-input"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="availability">
                Availability Window
              </label>
              <input
                id="availability"
                type="text"
                name="availability"
                className="form-input"
                value={formData.availability}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Description & Learning Objectives *
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tags">
                Tags (comma separated)
              </label>
              <input
                id="tags"
                type="text"
                name="tags"
                className="form-input"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-6)' }}>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={saving}
              >
                {saving ? <span className="spinner" /> : <><Save size={14} /> Save Updates</>}
              </button>
              <Link to="/my-skills" className="btn btn--ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSkill;
