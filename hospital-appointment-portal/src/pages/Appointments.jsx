import React, { useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppointmentContext } from '../context/AppointmentContext';
import AppointmentCard from '../components/AppointmentCard';
import EmptyState from '../components/EmptyState';
import { Calendar, CalendarX, CheckCircle, Clock } from 'lucide-react';
import './Appointments.css';

const Appointments = () => {
  const { appointments } = useContext(AppointmentContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  // Process appointments to classify past as completed
  const processedAppointments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.map(apt => {
      if (apt.status === 'Upcoming' && apt.date < today) {
        return { ...apt, status: 'Completed' };
      }
      return apt;
    });
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    if (activeTab === 'All') return processedAppointments;
    return processedAppointments.filter(apt => apt.status === activeTab);
  }, [processedAppointments, activeTab]);

  const getEmptyStateProps = () => {
    switch (activeTab) {
      case 'Upcoming':
        return {
          icon: Clock,
          title: "No upcoming appointments",
          description: "Book an appointment with one of our doctors.",
          actionText: "Find Doctors",
          onAction: () => navigate('/doctors')
        };
      case 'Past':
      case 'Completed':
        return {
          icon: CheckCircle,
          title: "No past appointments",
          description: "You don't have any completed appointments yet."
        };
      case 'Cancelled':
        return {
          icon: CalendarX,
          title: "No cancelled appointments",
          description: "No cancelled appointments found."
        };
      default:
        return {
          icon: Calendar,
          title: "No appointments found",
          description: "You haven't booked any appointments yet.",
          actionText: "Find Doctors",
          onAction: () => navigate('/doctors')
        };
    }
  };

  const emptyProps = getEmptyStateProps();

  return (
    <div className="page-container container">
      <div className="appointments-header">
        <h1 className="page-title">My Appointments</h1>
        <p className="page-subtitle">View and manage your appointment history.</p>
      </div>

      <div className="tabs-container">
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="appointments-content">
        {filteredAppointments.length > 0 ? (
          <div className="grid grid-2">
            {filteredAppointments.map(appointment => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                showCancel={appointment.status === 'Upcoming'}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={emptyProps.icon}
            title={emptyProps.title}
            description={emptyProps.description}
            actionText={emptyProps.actionText}
            onAction={emptyProps.onAction}
          />
        )}
      </div>
    </div>
  );
};

export default Appointments;
