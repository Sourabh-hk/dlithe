import React from 'react';

const Avatar = ({ src, name = '', size = 'md', className = '' }) => {
  const getInitials = (n) => {
    if (!n) return '?';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: { width: '32px', height: '32px', fontSize: '0.75rem' },
    md: { width: '40px', height: '40px', fontSize: '0.875rem' },
    lg: { width: '56px', height: '56px', fontSize: '1.125rem' },
    xl: { width: '80px', height: '80px', fontSize: '1.5rem' },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`avatar ${className}`}
        style={{
          width: currentSize.width,
          height: currentSize.height,
          borderRadius: 'var(--radius-full)',
          objectFit: 'cover',
          border: '1px solid var(--color-border)',
          display: 'inline-block',
          flexShrink: 0,
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          if (e.target.nextSibling) {
            e.target.nextSibling.style.display = 'flex';
          }
        }}
      />
    );
  }

  // Fallback initial generator
  const colors = [
    { bg: '#E0F2FE', text: '#0369A1' },
    { bg: '#FCE7F3', text: '#BE185D' },
    { bg: '#FEF3C7', text: '#B45309' },
    { bg: '#DCFCE7', text: '#15803D' },
    { bg: '#F3E8FF', text: '#7E22CE' },
    { bg: '#FFE4E6', text: '#E11D48' },
  ];
  const charCode = (name || 'A').charCodeAt(0) + ((name || 'A').charCodeAt(1) || 0);
  const color = colors[charCode % colors.length];

  return (
    <div
      className={`avatar-fallback ${className}`}
      style={{
        width: currentSize.width,
        height: currentSize.height,
        fontSize: currentSize.fontSize,
        borderRadius: 'var(--radius-full)',
        backgroundColor: color.bg,
        color: color.text,
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
