import { Link } from 'react-router-dom';
import '../styles/common.css';

const EmptyState = ({ title, description, actionText, actionLink, onAction }) => {
  return (
    <div className="empty-state-container">
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLink && (
        <Link to={actionLink} className="btn-primary">
          {actionText}
        </Link>
      )}
      {onAction && !actionLink && (
        <button onClick={onAction} className="btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
