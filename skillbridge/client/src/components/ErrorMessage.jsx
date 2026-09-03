import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div style={{ 
      backgroundColor: 'rgba(239, 68, 68, 0.1)', 
      border: '1px solid rgba(239, 68, 68, 0.2)', 
      borderRadius: 'var(--radius)', 
      padding: '1rem', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '0.5rem',
      margin: '1rem 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger-color)' }}>
        <AlertCircle size={20} />
        <span style={{ fontWeight: '500' }}>{message}</span>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary mt-2" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
