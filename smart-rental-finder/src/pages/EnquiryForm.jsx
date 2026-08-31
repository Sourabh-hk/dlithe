import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/enquiry.css';

const EnquiryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [errorProperty, setErrorProperty] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    moveInDate: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoadingProperty(true);
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (err) {
        setErrorProperty('Failed to load property details.');
      } finally {
        setLoadingProperty(false);
      }
    };

    fetchProperty();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[- ]/g, ''))) {
      newErrors.phone = 'Phone number should be 10 digits';
    }
    
    if (!formData.moveInDate) {
      newErrors.moveInDate = 'Move-in date is required';
    } else {
      const selectedDate = new Date(formData.moveInDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.moveInDate = 'Move-in date cannot be in the past';
      }
    }
    
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const enquiryPayload = {
        propertyId: id,
        ...formData,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      
      await api.post('/enquiries', enquiryPayload);
      setSubmitSuccess(true);
      
      // Navigate to My Enquiries after 2 seconds
      setTimeout(() => {
        navigate('/my-enquiries');
      }, 2000);
      
    } catch (err) {
      setSubmitError('Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProperty) return <Loading message="Loading property..." />;
  if (errorProperty) return <ErrorMessage message={errorProperty} />;
  if (!property) return <ErrorMessage message="Property not found." />;

  return (
    <div className="enquiry-page page-container">
      <div className="enquiry-layout">
        <div className="enquiry-form-container">
          <h1 className="section-title">Submit Enquiry</h1>
          
          {submitSuccess ? (
            <div className="success-message">
              <h3>Enquiry Submitted Successfully!</h3>
              <p>We have received your enquiry. The property owner will contact you soon.</p>
              <p>Redirecting to your enquiries...</p>
            </div>
          ) : (
            <form className="enquiry-form" onSubmit={handleSubmit}>
              {submitError && <div className="form-error-alert">{submitError}</div>}
              
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'input-error' : ''}
                  placeholder="John Doe"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                  placeholder="john@example.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'input-error' : ''}
                  placeholder="10 digit number"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="moveInDate">Preferred Move-in Date *</label>
                <input
                  type="date"
                  id="moveInDate"
                  name="moveInDate"
                  value={formData.moveInDate}
                  onChange={handleChange}
                  className={errors.moveInDate ? 'input-error' : ''}
                />
                {errors.moveInDate && <span className="error-text">{errors.moveInDate}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? 'input-error' : ''}
                  placeholder="I am interested in this property..."
                ></textarea>
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
        
        <div className="enquiry-property-summary">
          <h3>Property Summary</h3>
          <img src={property.image} alt={property.name} className="summary-image" />
          <h4>{property.name}</h4>
          <p>{property.location}, {property.city}</p>
          <div className="summary-price">₹{property.rent.toLocaleString('en-IN')}/mo</div>
          <p>{property.type} • {property.bedrooms} Bed • {property.bathrooms} Bath</p>
        </div>
      </div>
    </div>
  );
};

export default EnquiryForm;
