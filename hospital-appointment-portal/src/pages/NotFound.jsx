import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="page-container container" style={{ textAlign: 'center', padding: '6rem 0' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ marginBottom: '2rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button className="btn-primary" onClick={() => navigate('/')}>
        Return to Dashboard
      </button>
    </div>
  );
};

export default NotFound;
