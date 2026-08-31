import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaBed, FaBath } from 'react-icons/fa';
import { FavouritesContext } from '../context/FavouritesContext';
import '../styles/property-card.css';

const PropertyCard = ({ property }) => {
  const { toggleFavourite, isFavourited } = useContext(FavouritesContext);
  const favourited = isFavourited(property.id);

  const handleFavouriteClick = (e) => {
    e.preventDefault();
    toggleFavourite(property);
  };

  return (
    <div className="property-card">
      <div className="property-image-container">
        <img src={property.image} alt={property.name} className="property-image" />
        <div className="property-type-badge">{property.type}</div>
        <button className="favourite-btn" onClick={handleFavouriteClick} aria-label="Toggle favourite">
          {favourited ? <FaHeart className="favourited-icon" /> : <FaRegHeart className="unfavourited-icon" />}
        </button>
      </div>
      <div className="property-content">
        <div className="property-price">₹{property.rent.toLocaleString('en-IN')}<span className="per-month">/mo</span></div>
        <h3 className="property-title">{property.name}</h3>
        <p className="property-location">
          <FaMapMarkerAlt className="location-icon" /> {property.location}, {property.city}
        </p>
        <div className="property-features">
          <div className="feature">
            <FaBed className="feature-icon" /> {property.bedrooms} Beds
          </div>
          <div className="feature">
            <FaBath className="feature-icon" /> {property.bathrooms} Baths
          </div>
          <div className="feature">
            <span className="feature-area">{property.area} sqft</span>
          </div>
        </div>
        <Link to={`/properties/${property.id}`} className="btn-primary view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
