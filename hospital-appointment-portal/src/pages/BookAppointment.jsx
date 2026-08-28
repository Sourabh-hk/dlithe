import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctors } from '../data/doctors';
import { AppointmentContext } from '../context/AppointmentContext';
import Toast from '../components/Toast';
import './BookAppointment.css';

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addAppointment } = useContext(AppointmentContext);
  
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const foundDoctor = doctors.find(doc => doc.id === parseInt(id));
    if (foundDoctor) {
      setDoctor(foundDoctor);
    }
  }, [id]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!date) {
      showToast('Please select an appointment date.', 'error');
      return;
    }
    
    if (!time) {
      showToast('Please select an appointment time.', 'error');
      return;
    }

    addAppointment({
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      date,
      time,
      reason
    });

    showToast('Appointment booked successfully!', 'success');
    
    // Navigate to appointments after a short delay
    setTimeout(() => {
      navigate('/appointments');
    }, 1500);
  };

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  if (!doctor) {
    return <div className="container page-container">Loading...</div>;
  }

  return (
    <div className="page-container container">
      <div className="back-link" onClick={() => navigate(`/doctors/${doctor.id}`)}>
        &larr; Back to Doctor Details
      </div>
      
      <div className="booking-layout">
        <div className="booking-info-card card">
          <h2 className="section-title text-center">Booking Appointment With</h2>
          <div className="booking-doctor-info text-center mt-2">
            <img src={doctor.image} alt={doctor.name} className="booking-doctor-image" />
            <h3 className="booking-doctor-name">{doctor.name}</h3>
            <p className="booking-doctor-specialization">{doctor.specialization}</p>
          </div>
        </div>

        <div className="booking-form-card card">
          <h2 className="section-title">Appointment Details</h2>
          <form onSubmit={handleSubmit} className="booking-form">
            
            <div className="form-group">
              <label className="form-label" htmlFor="appointment-date">Appointment Date</label>
              <input 
                type="date" 
                id="appointment-date"
                className="form-control"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Time</label>
              <div className="time-slots-grid">
                {doctor.availability.map((slot, index) => (
                  <div 
                    key={index} 
                    className={`time-slot ${time === slot ? 'selected' : ''}`}
                    onClick={() => setTime(slot)}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reason">Reason for visit (Optional)</label>
              <textarea 
                id="reason"
                className="form-control"
                rows="3"
                placeholder="e.g. Regular health checkup"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary w-100 submit-btn">
              Confirm Appointment
            </button>
          </form>
        </div>
      </div>

      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}
    </div>
  );
};

export default BookAppointment;
