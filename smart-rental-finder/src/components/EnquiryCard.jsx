import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import '../styles/enquiry-card.css';

const EnquiryCard = ({ enquiry, onEdit, onDelete }) => {
  return (
    <div className="enquiry-card">
      <div className="enquiry-header">
        <div className="enquiry-property-info">
          <h3>Property ID: {enquiry.propertyId}</h3>
          <span className={`status-badge status-${enquiry.status.toLowerCase()}`}>
            {enquiry.status}
          </span>
        </div>
        <div className="enquiry-actions">
          <button className="icon-btn edit-btn" onClick={() => onEdit(enquiry)} aria-label="Edit enquiry">
            <FiEdit2 />
          </button>
          <button className="icon-btn delete-btn" onClick={() => onDelete(enquiry.id)} aria-label="Cancel enquiry">
            <FiTrash2 />
          </button>
        </div>
      </div>
      
      <div className="enquiry-details">
        <div className="detail-item">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{enquiry.name}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{enquiry.email}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Phone:</span>
          <span className="detail-value">{enquiry.phone}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Move-in Date:</span>
          <span className="detail-value">{new Date(enquiry.moveInDate).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="enquiry-message">
        <span className="detail-label">Message:</span>
        <p>{enquiry.message}</p>
      </div>
    </div>
  );
};

export default EnquiryCard;
