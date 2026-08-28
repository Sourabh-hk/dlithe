import React, { useContext, useMemo } from 'react';
import { AppointmentContext } from '../context/AppointmentContext';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import './AppointmentSummary.css';

const AppointmentSummary = () => {
  const { appointments } = useContext(AppointmentContext);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Automatically classify any past upcoming as completed for UI
    let upcoming = 0;
    let completed = 0;
    let cancelled = 0;

    appointments.forEach(apt => {
      if (apt.status === 'Cancelled') {
        cancelled++;
      } else if (apt.status === 'Completed' || (apt.status === 'Upcoming' && apt.date < today)) {
        completed++;
      } else {
        upcoming++;
      }
    });

    return {
      total: appointments.length,
      upcoming,
      completed,
      cancelled
    };
  }, [appointments]);

  return (
    <div className="summary-grid grid grid-4">
      <div className="summary-card card">
        <div className="summary-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
          <Calendar size={24} />
        </div>
        <div className="summary-info">
          <span className="summary-label">Total Appointments</span>
          <h3 className="summary-value">{stats.total}</h3>
        </div>
      </div>
      
      <div className="summary-card card">
        <div className="summary-icon-wrapper" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
          <Clock size={24} />
        </div>
        <div className="summary-info">
          <span className="summary-label">Upcoming</span>
          <h3 className="summary-value">{stats.upcoming}</h3>
        </div>
      </div>

      <div className="summary-card card">
        <div className="summary-icon-wrapper" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
          <CheckCircle size={24} />
        </div>
        <div className="summary-info">
          <span className="summary-label">Completed</span>
          <h3 className="summary-value">{stats.completed}</h3>
        </div>
      </div>

      <div className="summary-card card">
        <div className="summary-icon-wrapper" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
          <XCircle size={24} />
        </div>
        <div className="summary-info">
          <span className="summary-label">Cancelled</span>
          <h3 className="summary-value">{stats.cancelled}</h3>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSummary;
