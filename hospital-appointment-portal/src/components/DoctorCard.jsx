import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/doctors/${doctor.id}`);
  };

  return (
    <div className="doctor-card card" onClick={handleViewDetails}>
      <div className="doctor-card-header">
        <img src={doctor.image} alt={doctor.name} className="doctor-image" />
        <div className="doctor-info-basic">
          <h3 className="doctor-name">{doctor.name}</h3>
          <p className="doctor-specialization">{doctor.specialization}</p>
        </div>
      </div>
      
      <div className="doctor-card-body">
        <div className="doctor-detail-item">
          <Star className="detail-icon" size={16} />
          <span>{doctor.experience} Years Experience</span>
        </div>
        <div className="doctor-detail-item">
          <Clock className="detail-icon" size={16} />
          <span className="availability-text">Available Today</span>
        </div>
      </div>
      
      <div className="doctor-card-footer">
        <button className="btn-outline w-100" onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
