import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Activity } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <Activity className="logo-icon" size={24} />
          <span>HMS</span>
        </NavLink>
        
        <div className="mobile-menu-btn" onClick={toggleMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
        
        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => 'nav-link' + (isActive ? ' active-link' : '')} onClick={closeMenu} end>
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/doctors" className={({ isActive }) => 'nav-link' + (isActive ? ' active-link' : '')} onClick={closeMenu}>
              Doctors
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/appointments" className={({ isActive }) => 'nav-link' + (isActive ? ' active-link' : '')} onClick={closeMenu}>
              Appointments
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
