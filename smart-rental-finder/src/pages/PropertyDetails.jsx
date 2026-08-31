import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import api from '../api/api';
import { FavouritesContext } from '../context/FavouritesContext';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/property-details.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { toggleFavourite, isFavourited } = useContext(FavouritesContext);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/properties/${id}`);
      setProperty(response.data);
    } catch (err) {
      setError('Failed to load property details. The property may not exist.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  if (loading) return <Loading message="Loading property details..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchPropertyDetails} />;
  if (!property) return <ErrorMessage message="Property not found" />;

  const favourited = isFavourited(property.id);

  return (
    <div className="property-details-page page-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="property-details-container">
        <div className="property-main-image-container">
          <img src={property.image} alt={property.name} className="property-main-image" />
          <div className="property-badges">
            <span className="badge-type">{property.type}</span>
            <span className="badge-furnishing">{property.furnishing}</span>
          </div>
          <button 
            className="detail-favourite-btn" 
            onClick={() => toggleFavourite(property)}
            aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
          >
            {favourited ? <FaHeart className="favourited-icon" /> : <FaRegHeart className="unfavourited-icon" />}
            <span>{favourited ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <div className="property-info-section">
          <div className="property-header">
            <div>
              <h1 className="property-title-large">{property.name}</h1>
              <p className="property-full-address">
                <FaMapMarkerAlt className="location-icon" /> {property.location}, {property.city}
              </p>
            </div>
            <div className="property-price-large">
              ₹{property.rent.toLocaleString('en-IN')}<span>/month</span>
            </div>
          </div>

          <div className="property-key-features">
            <div className="key-feature">
              <FaBed className="key-feature-icon" />
              <div>
                <span className="key-feature-value">{property.bedrooms}</span>
                <span className="key-feature-label">Bedrooms</span>
              </div>
            </div>
            <div className="key-feature">
              <FaBath className="key-feature-icon" />
              <div>
                <span className="key-feature-value">{property.bathrooms}</span>
                <span className="key-feature-label">Bathrooms</span>
              </div>
            </div>
            <div className="key-feature">
              <FaRulerCombined className="key-feature-icon" />
              <div>
                <span className="key-feature-value">{property.area} sqft</span>
                <span className="key-feature-label">Area</span>
              </div>
            </div>
          </div>

          <div className="property-description">
            <h3>About this property</h3>
            <p>{property.description}</p>
          </div>

          <div className="property-amenities">
            <h3>Amenities</h3>
            <ul className="amenities-list">
              {property.amenities.map((amenity, index) => (
                <li key={index} className="amenity-item">
                  <FaCheckCircle className="amenity-icon" /> {amenity}
                </li>
              ))}
            </ul>
          </div>

          <div className="property-actions">
            <Link to={`/enquiry/${property.id}`} className="btn-primary enquire-large-btn">
              Enquire Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
