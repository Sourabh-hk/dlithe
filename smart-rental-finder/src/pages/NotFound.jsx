import { Link } from 'react-router-dom';
import '../styles/common.css';

const NotFound = () => {
  return (
    <div className="page-container">
      <div className="empty-state-container" style={{ marginTop: '4rem' }}>
        <h1 style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '1rem' }}>404</h1>
        <h3>Page Not Found</h3>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
