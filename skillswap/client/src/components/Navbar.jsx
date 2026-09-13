import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" onClick={closeMobile}>
          Skill<span>Swap</span>
        </Link>

        <nav className={`navbar__nav ${mobileOpen ? 'navbar__nav--open' : ''}`}>
          <div className="navbar__links">
            <NavLink to="/explore" className="navbar__link" onClick={closeMobile}>
              Explore Skills
            </NavLink>
            {!isAuthenticated && (
              <a href="/#how-it-works" className="navbar__link" onClick={closeMobile}>
                How It Works
              </a>
            )}
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className="navbar__link" onClick={closeMobile}>
                  Dashboard
                </NavLink>
                <NavLink to="/bookings" className="navbar__link" onClick={closeMobile}>
                  Bookings
                </NavLink>
              </>
            )}
          </div>

          <div className="navbar__actions">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn--ghost" onClick={closeMobile}>
                  Log in
                </Link>
                <Link to="/register" className="btn btn--primary" onClick={closeMobile}>
                  Get Started
                </Link>
              </>
            ) : (
              <div className="navbar__user">
                <button
                  className="navbar__avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User menu"
                >
                  <div className="navbar__avatar">{initials}</div>
                  <span className="navbar__username hide-mobile">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="navbar__dropdown-overlay" onClick={() => setDropdownOpen(false)} />
                    <div className="navbar__dropdown">
                      <div className="navbar__dropdown-header">
                        <p className="navbar__dropdown-name">{user.name}</p>
                        <p className="navbar__dropdown-email">{user.email}</p>
                      </div>
                      <div className="navbar__dropdown-divider" />
                      <Link to="/dashboard" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <Link to="/profile" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <User size={15} /> Profile
                      </Link>
                      {(user.role === 'mentor' || (user.skillsOffered && user.skillsOffered.length > 0)) && (
                        <Link to="/my-skills" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <BookOpen size={15} /> My Skills
                        </Link>
                      )}
                      <Link to="/reviews" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                        Reviews
                      </Link>
                      <div className="navbar__dropdown-divider" />
                      <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                        <LogOut size={15} /> Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>

        <button
          className="navbar__toggle hide-desktop"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
