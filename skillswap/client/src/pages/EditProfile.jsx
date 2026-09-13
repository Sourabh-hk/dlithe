import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    title: user?.title || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    role: user?.role || 'learner',
    location: user?.location || '',
    website: user?.website || '',
    skillsWanted: user?.learningInterests ? user.learningInterests.join(', ') : (user?.skillsWanted ? user.skillsWanted.join(', ') : ''),
    skillsOffered: user?.skillsOffered ? user.skillsOffered.join(', ') : '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        skillsWanted: formData.skillsWanted
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        skillsOffered: formData.skillsOffered
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await userService.updateProfile(payload);
      const updatedUser = res.data.user || res.data;
      updateUser(updatedUser);
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page page">
      <div className="container container--form">
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <Link to="/profile" className="btn btn--ghost btn--sm">
            <ArrowLeft size={16} /> Back to Profile
          </Link>
        </div>

        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-2)' }}>
            Edit Profile
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            Keep your profile up-to-date so peers can find and connect with you.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Professional Title / Headline
              </label>
              <input
                id="title"
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Senior Frontend Engineer | Passionate Educator"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="role">
                Account Type / Role
              </label>
              <select
                id="role"
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="learner">Learner (Focus on booking sessions)</option>
                <option value="mentor">Mentor (Can offer skills & earn)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="avatar">
                Avatar Image URL
              </label>
              <input
                id="avatar"
                type="url"
                name="avatar"
                className="form-input"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatar}
                onChange={handleChange}
              />
              <p className="form-hint">Paste any valid image link.</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bio">
                About / Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                className="form-textarea"
                placeholder="Tell the community about your background, journey, and passions..."
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="skillsOffered">
                Skills I Can Teach (comma separated)
              </label>
              <input
                id="skillsOffered"
                type="text"
                name="skillsOffered"
                className="form-input"
                placeholder="React, TypeScript, UI Design, Guitar"
                value={formData.skillsOffered}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="skillsWanted">
                Skills I Want to Learn (comma separated)
              </label>
              <input
                id="skillsWanted"
                type="text"
                name="skillsWanted"
                className="form-input"
                placeholder="Spanish, Public Speaking, Python"
                value={formData.skillsWanted}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                type="text"
                name="location"
                className="form-input"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="website">
                Website or Portfolio Link
              </label>
              <input
                id="website"
                type="url"
                name="website"
                className="form-input"
                placeholder="https://yourportfolio.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-8)' }}>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : <><Save size={16} /> Save Changes</>}
              </button>
              <Link to="/profile" className="btn btn--ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
