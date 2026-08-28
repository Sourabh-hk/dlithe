import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { patient } from '../data/patient';
import { AppointmentContext } from '../context/AppointmentContext';
import AppointmentSummary from '../components/AppointmentSummary';
import AppointmentCard from '../components/AppointmentCard';
import EmptyState from '../components/EmptyState';
import { Calendar } from 'lucide-react';
import './Home.css';

const Home = () => {
  const { appointments } = useContext(AppointmentContext);
  const navigate = useNavigate();

  const getUpcomingAppointment = () => {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = appointments.filter(apt => apt.status === 'Upcoming' && apt.date >= today);
    // Sort to get the nearest upcoming appointment
    upcoming.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
    return upcoming.length > 0 ? upcoming[0] : null;
  };

  const nextAppointment = getUpcomingAppointment();

  return (
    <div className="page-container container">
      <header className="home-header">
        <h1 className="welcome-text">Welcome back, {patient.name}</h1>
        <p className="subtitle">Manage your healthcare appointments and track your history.</p>
      </header>

      <div className="dashboard-content grid grid-3">
        <div className="patient-profile card">
          <h2 className="section-title">Patient Details</h2>
          <div className="profile-details">
            <div className="detail-item">
              <span className="label">Patient Name</span>
              <span className="value">{patient.name}</span>
            </div>
            <div className="detail-item">
              <span className="label">Patient ID</span>
              <span className="value">{patient.id}</span>
            </div>
            <div className="detail-item">
              <span className="label">Age</span>
              <span className="value">{patient.age}</span>
            </div>
            <div className="detail-item">
              <span className="label">Gender</span>
              <span className="value">{patient.gender}</span>
            </div>
            <div className="detail-item">
              <span className="label">Contact</span>
              <span className="value">{patient.contactNumber}</span>
            </div>
            <div className="detail-item">
              <span className="label">Blood Group</span>
              <span className="value-highlight">{patient.bloodGroup}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-main">
          <h2 className="section-title">Overview</h2>
          <AppointmentSummary />

          <h2 className="section-title mt-2">Next Upcoming Appointment</h2>
          {nextAppointment ? (
            <div className="next-appointment">
              <AppointmentCard appointment={nextAppointment} />
              <button 
                className="btn-outline w-100 mt-1" 
                onClick={() => navigate('/appointments')}
              >
                View All Appointments
              </button>
            </div>
          ) : (
            <EmptyState 
              icon={Calendar}
              title="No upcoming appointments"
              description="You don't have any upcoming appointments at the moment."
              actionText="Book Appointment"
              onAction={() => navigate('/doctors')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
