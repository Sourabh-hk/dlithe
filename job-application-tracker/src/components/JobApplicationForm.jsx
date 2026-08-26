import React, { useState, useEffect, useRef } from 'react';

const JobApplicationForm = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    applicationDate: '',
    status: 'Applied'
  });
  
  const [errors, setErrors] = useState({});
  const companyInputRef = useRef(null);

  useEffect(() => {
    if (companyInputRef.current) {
      companyInputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required.';
    if (!formData.jobRole.trim()) newErrors.jobRole = 'Job role is required.';
    if (!formData.applicationDate) newErrors.applicationDate = 'Application date is required.';
    if (!formData.status) newErrors.status = 'Status is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onAdd({
        id: Date.now(),
        companyName: formData.companyName.trim(),
        jobRole: formData.jobRole.trim(),
        applicationDate: formData.applicationDate,
        status: formData.status
      });
      setFormData({
        companyName: '',
        jobRole: '',
        applicationDate: '',
        status: 'Applied'
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="form-container">
        <h2>Add Application</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="form-control"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={handleChange}
              ref={companyInputRef}
            />
            {errors.companyName && <span className="form-error">{errors.companyName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="jobRole">Job Role</label>
            <input
              type="text"
              id="jobRole"
              name="jobRole"
              className="form-control"
              placeholder="e.g. Frontend Developer"
              value={formData.jobRole}
              onChange={handleChange}
            />
            {errors.jobRole && <span className="form-error">{errors.jobRole}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="applicationDate">Application Date</label>
            <input
              type="date"
              id="applicationDate"
              name="applicationDate"
              className="form-control"
              value={formData.applicationDate}
              onChange={handleChange}
            />
            {errors.applicationDate && <span className="form-error">{errors.applicationDate}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              className="form-control"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            {errors.status && <span className="form-error">{errors.status}</span>}
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm;
