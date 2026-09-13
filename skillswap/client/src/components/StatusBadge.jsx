import React from 'react';

const StatusBadge = ({ status = 'pending', type = 'status', className = '' }) => {
  const normalized = (status || '').toLowerCase();

  if (type === 'level') {
    return (
      <span className={`badge badge--level ${className}`}>
        {status}
      </span>
    );
  }

  if (type === 'category') {
    return (
      <span className={`badge badge--category ${className}`}>
        {status}
      </span>
    );
  }

  const badgeClass = {
    pending: 'badge--pending',
    accepted: 'badge--accepted',
    rejected: 'badge--rejected',
    completed: 'badge--completed',
    cancelled: 'badge--cancelled',
  }[normalized] || 'badge--pending';

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
