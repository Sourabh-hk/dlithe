import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkillContext } from '../context/SkillContext';
import skillService from '../services/skillService';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = [
  'Web Development', 'Mobile Development', 'Graphic Design', 
  'Photography', 'Music', 'Languages', 'Digital Marketing', 
  'Data Science', 'Fitness', 'Cooking', 'Other'
];

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const AVAILABILITIES = ['Weekdays', 'Weekends', 'Morning', 'Afternoon', 'Evening', 'Flexible'];

const AddSkill = () => {
  const navigate = useNavigate();
  const { fetchSkills } = useContext(SkillContext);
  
  const [formData, setFormData] = useState({
    skillName: '',
    category: '',
    description: '',
    experienceLevel: '',
    availability: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.skillName.trim()) newErrors.skillName = 'Skill name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.trim().length < 20) newErrors.description = 'Description should be at least 20 characters';
    if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
    if (!formData.availability) newErrors.availability = 'Availability is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await skillService.createSkill(formData);
      // Refresh context
      await fetchSkills();
      // Navigate to My Skills
      navigate('/my-skills', { state: { message: 'Skill created successfully!' } });
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Something went wrong while creating the skill.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Offer a Skill</h1>
        <p className="text-light">Share your expertise with the community. Fill out the details below.</p>
      </div>

      <div className="card">
        {submitError && <ErrorMessage message={submitError} />}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="skillName">Skill Name *</label>
            <input 
              type="text" 
              id="skillName"
              name="skillName"
              className="form-control"
              placeholder="e.g., React.js Development"
              value={formData.skillName}
              onChange={handleChange}
            />
            {errors.skillName && <div className="form-error">{errors.skillName}</div>}
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="category">Category *</label>
              <select 
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <div className="form-error">{errors.category}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="experienceLevel">Experience Level *</label>
              <select 
                id="experienceLevel"
                name="experienceLevel"
                className="form-control"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="">Select your level</option>
                {EXPERIENCE_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              {errors.experienceLevel && <div className="form-error">{errors.experienceLevel}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="availability">Availability *</label>
            <select 
              id="availability"
              name="availability"
              className="form-control"
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="">Select availability</option>
              {AVAILABILITIES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            {errors.availability && <div className="form-error">{errors.availability}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description *</label>
            <textarea 
              id="description"
              name="description"
              className="form-control"
              placeholder="Describe what you can teach and your teaching approach..."
              rows="5"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            {errors.description && <div className="form-error">{errors.description}</div>}
            <p className="text-light" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Minimum 20 characters.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Create Skill Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkill;
