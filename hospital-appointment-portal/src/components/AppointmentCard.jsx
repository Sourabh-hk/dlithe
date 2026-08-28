import React, { useContext } from 'react';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { AppointmentContext } from '../context/AppointmentContext';
import './AppointmentCard.css';

const AppointmentCard = ({ appointment, showCancel = true }) => {
  const { cancelAppointment } = useContext(AppointmentContext);

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      cancelAppointment(appointment.id);
      // Ideally we'd trigger a toast here, but we will handle toast via a callback or rely on the parent.
      // Since context doesn't have toast, we'll let it be for now or add a custom event.
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Upcoming': return 'badge-upcoming';
      case 'Completed': return 'badge-completed';
      case 'Cancelled': return 'badge-cancelled';
      default: return 'badge-upcoming';
    }
  };

  return (
    <div className="appointment-card card">
      <div className="appointment-header">
        <div className="doctor-info">
          <h4 className="doctor-name">{appointment.doctorName}</h4>
          <span className="doctor-specialization">{appointment.specialization}</span>
        </div>
        <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>

      <div className="appointment-details">
        <div className="detail-row">
          <Calendar size={16} className="detail-icon" />
          <span>{new Date(appointment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="detail-row">
          <Clock size={16} className="detail-icon" />
          <span>{appointment.time}</span>
        </div>
        {appointment.reason && (
          <div className="detail-row align-start">
            <FileText size={16} className="detail-icon mt-1" />
            <span>Reason: {appointment.reason}</span>
          </div>
        )}
      </div>

      {showCancel && appointment.status === 'Upcoming' && (
        <div className="appointment-actions">
          <button className="btn-danger w-100" onClick={handleCancel}>
            Cancel Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
