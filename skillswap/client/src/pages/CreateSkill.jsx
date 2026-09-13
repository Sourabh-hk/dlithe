import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
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

const CreateSkill = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'Intermediate',
    duration: 60,
    price: 30,
    availability: 'Weekday evenings, weekend mornings',
    tags: '',
  });
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const payload = {
        name: formData.title.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        experienceLevel: formData.level,
        level: formData.level,
        hourlyRate: Number(formData.price) || 0,
        price: Number(formData.price) || 0,
        duration: Number(formData.duration) || 60,
        availability: formData.availability.trim() || 'Flexible schedule',
        tags: formData.tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
      };

      const res = await skillService.createSkill(payload);
      toast.success('Skill listed successfully!');
      const createdId = res.data.skill?._id || res.data._id || res.data.id;
      navigate(createdId ? `/skills/${createdId}` : '/my-skills');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create skill';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-skill-page page">
      <div className="container container--form">
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <Link to="/my-skills" className="btn btn--ghost btn--sm">
            <ArrowLeft size={15} /> Back to My Skills
          </Link>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.25rem' }}>
            List a New Mentorship Skill
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-5)' }}>
            Publish a structured curriculum or coaching topic for 1-on-1 bookings.
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
                placeholder="e.g. Modern React Architecture & State Management"
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
                  placeholder="0 for free community session"
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
                placeholder="e.g. Weekday evenings, Saturday mornings"
                value={formData.availability}
                onChange={handleChange}
              />
              <p className="form-hint">Let learners know when you typically take sessions.</p>
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
                placeholder="Describe what learners will gain from this session, topics covered, and any tools required..."
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
                placeholder="react, redux, typescript, frontend"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-6)' }}>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : <><Check size={14} /> Publish Listing</>}
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

export default CreateSkill;
