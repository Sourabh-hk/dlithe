import React from 'react';

const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              <div className="skeleton skeleton--avatar" />
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton--text" style={{ width: '60%' }} />
                <div className="skeleton skeleton--text" style={{ width: '40%', height: '10px' }} />
              </div>
            </div>
            <div className="skeleton skeleton--title" style={{ marginTop: 'var(--space-2)' }} />
            <div className="skeleton skeleton--text" style={{ width: '90%' }} />
            <div className="skeleton skeleton--text" style={{ width: '70%' }} />
            <div
              style={{
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 'var(--space-3)',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <div className="skeleton skeleton--text" style={{ width: '30%', height: '18px' }} />
              <div className="skeleton skeleton--text" style={{ width: '25%', height: '18px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: 'var(--space-4) var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flex: 1 }}>
              <div className="skeleton skeleton--avatar" />
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton--text" style={{ width: '40%' }} />
                <div className="skeleton skeleton--text" style={{ width: '25%', height: '12px' }} />
              </div>
            </div>
            <div className="skeleton skeleton--text" style={{ width: '80px', height: '28px', borderRadius: 'var(--radius-full)' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <div className="skeleton skeleton--title" style={{ width: '50%' }} />
      <div className="skeleton skeleton--text" style={{ width: '80%' }} />
      <div className="skeleton skeleton--text" style={{ width: '65%' }} />
    </div>
  );
};

export default LoadingSkeleton;
