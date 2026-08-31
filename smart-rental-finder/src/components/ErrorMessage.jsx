import { MdErrorOutline } from 'react-icons/md';
import '../styles/common.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <MdErrorOutline className="error-icon" />
      <h3>Oops! Something went wrong</h3>
      <p>{message || 'Failed to fetch data. Please try again.'}</p>
      {onRetry && (
        <button className="btn-primary retry-btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
