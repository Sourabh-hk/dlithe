import React from 'react';
import { Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no items to display at this time.',
  actionLabel,
  actionLink,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-12) var(--space-6)',
        textAlign: 'center',
        backgroundColor: 'var(--color-surface)',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        margin: 'var(--space-4) 0',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-tertiary)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>
        {title}
      </h3>
      <p
        style={{
          color: 'var(--color-text-secondary)',
          maxWidth: '400px',
          marginBottom: actionLabel ? 'var(--space-6)' : 0,
        }}
      >
        {description}
      </p>

      {actionLabel && actionLink && (
        <Link to={actionLink} className="btn btn--primary">
          {actionLabel}
        </Link>
      )}

      {actionLabel && !actionLink && onAction && (
        <button onClick={onAction} className="btn btn--primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
