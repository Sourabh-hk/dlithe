import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiMenu, FiX, FiHome } from 'react-icons/fi';
import '../styles/navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <FiHome className="logo-icon" />
          <span>SmartRental</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/properties" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Properties
          </NavLink>
          <NavLink to="/favourites" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Favourites
          </NavLink>
          <NavLink to="/my-enquiries" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            My Enquiries
          </NavLink>
        </div>

        {/* Mobile Menu Icon */}
        <div className="mobile-menu-icon" onClick={toggleMenu}>
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" className="mobile-nav-link" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/properties" className="mobile-nav-link" onClick={closeMenu}>
            Properties
          </NavLink>
          <NavLink to="/favourites" className="mobile-nav-link" onClick={closeMenu}>
            Favourites
          </NavLink>
          <NavLink to="/my-enquiries" className="mobile-nav-link" onClick={closeMenu}>
            My Enquiries
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
