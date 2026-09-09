import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isOperator = location.pathname.startsWith('/operator');

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <Users className="navbar-icon" />
          <span>QueueFlow</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`navbar-link ${!isOperator ? 'active' : ''}`}>
            User Portal
          </Link>
          <Link to="/operator" className={`navbar-link ${isOperator ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            Operator
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
