import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppointmentProvider } from './context/AppointmentContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import DoctorDetails from './pages/DoctorDetails';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointments';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AppointmentProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:id" element={<DoctorDetails />} />
              <Route path="/book/:id" element={<BookAppointment />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppointmentProvider>
  );
}

export default App;
