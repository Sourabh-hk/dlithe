import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctors } from '../data/doctors';
import { Star, MapPin, Award, Clock } from 'lucide-react';
import './DoctorDetails.css';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const foundDoctor = doctors.find(doc => doc.id === parseInt(id));
    if (foundDoctor) {
      setDoctor(foundDoctor);
    }
  }, [id]);

  if (!doctor) {
    return (
      <div className="page-container container not-found-container">
        <h2>Doctor not found.</h2>
        <button className="btn-primary mt-1" onClick={() => navigate('/doctors')}>
          Back to Doctors
        </button>
      </div>
    );
  }

  return (
    <div className="page-container container">
      <div className="back-link" onClick={() => navigate('/doctors')}>
        &larr; Back to Doctors
      </div>

      <div className="doctor-profile-grid">
        <div className="doctor-profile-left">
          <div className="card text-center profile-main-card">
            <img src={doctor.image} alt={doctor.name} className="profile-image-large" />
            <h1 className="profile-name">{doctor.name}</h1>
            <p className="profile-specialization">{doctor.specialization}</p>
            <button 
              className="btn-primary w-100 mt-2"
              onClick={() => navigate(`/book/${doctor.id}`)}
            >
              Book Appointment
            </button>
          </div>
        </div>

        <div className="doctor-profile-right">
          <div className="card profile-details-card">
            <h2 className="section-title">About Doctor</h2>
            <p className="about-text">{doctor.about}</p>

            <div className="info-grid mt-2">
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <Star className="info-icon" size={20} />
                </div>
                <div>
                  <span className="info-label">Experience</span>
                  <p className="info-value">{doctor.experience} Years</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <MapPin className="info-icon" size={20} />
                </div>
                <div>
                  <span className="info-label">Hospital</span>
                  <p className="info-value">{doctor.hospital}</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <Award className="info-icon" size={20} />
                </div>
                <div>
                  <span className="info-label">Education</span>
                  <p className="info-value">{doctor.education}</p>
                </div>
              </div>
            </div>

            <h2 className="section-title mt-2">Available Slots</h2>
            <div className="slots-container">
              {doctor.availability.map((slot, index) => (
                <div key={index} className="slot-badge">
                  <Clock size={14} className="slot-icon" />
                  {slot}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
