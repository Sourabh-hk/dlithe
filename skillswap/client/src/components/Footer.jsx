import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              Skill<span>Swap</span>
            </Link>
            <p className="footer__tagline">Learn from people. Share what you know.</p>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Explore</h4>
            <Link to="/explore" className="footer__link">Browse Skills</Link>
            <Link to="/explore?category=Web Development" className="footer__link">Web Development</Link>
            <Link to="/explore?category=Design" className="footer__link">Design</Link>
            <Link to="/explore?category=Music" className="footer__link">Music</Link>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Account</h4>
            <Link to="/dashboard" className="footer__link">Dashboard</Link>
            <Link to="/profile" className="footer__link">Profile</Link>
            <Link to="/my-skills" className="footer__link">My Skills</Link>
            <Link to="/bookings" className="footer__link">Bookings</Link>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">About</h4>
            <span className="footer__link">Community</span>
            <span className="footer__link">Privacy</span>
            <span className="footer__link">Terms</span>
            <span className="footer__link">Contact</span>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} SkillSwap. Built for learning.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
