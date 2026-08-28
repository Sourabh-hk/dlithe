import React, { createContext, useState, useEffect } from 'react';

export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hms_appointments');
    if (saved) {
      setAppointments(JSON.parse(saved));
    } else {
      // Load mock appointment if empty
      const initialAppointments = [
        {
          id: "APT-10001",
          doctorId: 1,
          doctorName: "Dr. Ananya Sharma",
          specialization: "Cardiologist",
          date: "2026-10-15",
          time: "11:00 AM",
          status: "Upcoming",
          reason: "Regular checkup"
        }
      ];
      setAppointments(initialAppointments);
      localStorage.setItem('hms_appointments', JSON.stringify(initialAppointments));
    }
  }, []);

  // Save to localStorage whenever appointments change
  useEffect(() => {
    localStorage.setItem('hms_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (appointmentData) => {
    const newAppointment = {
      ...appointmentData,
      id: `APT-${Math.floor(10000 + Math.random() * 90000)}`,
      status: "Upcoming"
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const cancelAppointment = (id) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: "Cancelled" } : apt
    ));
  };

  // Helper to categorize appointments (since requirement mentions moving past ones automatically)
  // We can just expose raw appointments and let pages filter them, or update them here.
  // We'll let the pages filter them based on current date.

  return (
    <AppointmentContext.Provider value={{
      appointments,
      addAppointment,
      cancelAppointment
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};
