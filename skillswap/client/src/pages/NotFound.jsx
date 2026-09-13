import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="not-found-page page">
      <div className="container text-center" style={{ padding: 'var(--space-16) 0' }}>
        <h1 style={{ fontSize: '5rem', fontWeight: '800', color: 'var(--color-primary)', lineHeight: 1, marginBottom: 'var(--space-2)' }}>
          404
        </h1>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-4)' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '460px', margin: '0 auto var(--space-8)' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
          <Link to="/" className="btn btn--primary">
            <Home size={16} /> Go Home
          </Link>
          <Link to="/explore" className="btn btn--outline">
            <Compass size={16} /> Explore Skills
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
