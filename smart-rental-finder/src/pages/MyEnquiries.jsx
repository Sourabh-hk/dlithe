import { useState, useEffect } from 'react';
import api from '../api/api';
import EnquiryCard from '../components/EnquiryCard';
import ConfirmModal from '../components/ConfirmModal';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import '../styles/enquiry.css';

const MyEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [enquiryToEdit, setEnquiryToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({ phone: '', moveInDate: '', message: '' });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/enquiries');
      setEnquiries(response.data);
    } catch (err) {
      setError('Failed to load your enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDeleteClick = (id) => {
    setEnquiryToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/enquiries/${enquiryToDelete}`);
      setEnquiries(enquiries.filter(e => e.id !== enquiryToDelete));
      setDeleteModalOpen(false);
      setEnquiryToDelete(null);
    } catch (err) {
      alert('Failed to delete enquiry. Please try again.');
    }
  };

  const handleEditClick = (enquiry) => {
    setEnquiryToEdit(enquiry);
    setEditFormData({
      phone: enquiry.phone,
      moveInDate: enquiry.moveInDate,
      message: enquiry.message
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    setEditError(null);
    
    try {
      const response = await api.patch(`/enquiries/${enquiryToEdit.id}`, editFormData);
      setEnquiries(enquiries.map(e => e.id === enquiryToEdit.id ? response.data : e));
      setEditModalOpen(false);
      setEnquiryToEdit(null);
    } catch (err) {
      setEditError('Failed to update enquiry.');
    } finally {
      setEditSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading your enquiries..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchEnquiries} />;

  return (
    <div className="my-enquiries-page page-container">
      <h1 className="section-title">My Enquiries</h1>
      
      {enquiries.length === 0 ? (
        <EmptyState 
          title="No enquiries found"
          description="You haven't submitted any enquiries yet."
          actionText="Browse Properties"
          actionLink="/properties"
        />
      ) : (
        <div className="enquiries-list">
          {enquiries.map(enquiry => (
            <EnquiryCard 
              key={enquiry.id} 
              enquiry={enquiry} 
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <ConfirmModal 
        isOpen={deleteModalOpen}
        title="Cancel Enquiry"
        message="Are you sure you want to cancel this enquiry? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setEnquiryToDelete(null);
        }}
      />
      
      {/* Edit Modal Inline Implementation */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Enquiry</h3>
            {editError && <div className="form-error-alert">{editError}</div>}
            <form onSubmit={handleEditSubmit} className="enquiry-form edit-form">
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Move-in Date</label>
                <input 
                  type="date" 
                  value={editFormData.moveInDate}
                  onChange={(e) => setEditFormData({...editFormData, moveInDate: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea 
                  rows="3"
                  value={editFormData.message}
                  onChange={(e) => setEditFormData({...editFormData, message: e.target.value})}
                  required
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={editSubmitting}>
                  {editSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEnquiries;
