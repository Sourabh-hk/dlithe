import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
      <Search size={64} color="var(--border-color)" style={{ marginBottom: '1.5rem' }} />
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-color)' }}>404</h1>
      <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
      <p className="text-light" style={{ maxWidth: '400px', marginBottom: '2rem' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
