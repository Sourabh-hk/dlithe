import React, { useState } from 'react';
import queueService from '../services/queueService';
import { useToast } from '../context/ToastContext';
import { X } from 'lucide-react';

const CreateQueueModal = ({ isOpen, onClose, onQueueCreated }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ serviceName: '', counterNumber: '', maxCapacity: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await queueService.createQueue({ ...formData, maxCapacity: Number(formData.maxCapacity) });
      showToast('Queue created successfully');
      setFormData({ serviceName: '', counterNumber: '', maxCapacity: '' });
      onQueueCreated();
      onClose();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error creating queue', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Create New Queue</h2>
          <button onClick={onClose} className="text-muted"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="form-label">Service Name</label>
            <input type="text" name="serviceName" value={formData.serviceName} onChange={handleChange} className="form-input" placeholder="e.g. Aadhaar Update" required />
          </div>
          <div className="form-group mb-4">
            <label className="form-label">Counter Number</label>
            <input type="text" name="counterNumber" value={formData.counterNumber} onChange={handleChange} className="form-input" placeholder="e.g. 03" required />
          </div>
          <div className="form-group mb-6">
            <label className="form-label">Maximum Capacity</label>
            <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} className="form-input" placeholder="e.g. 50" min="1" required />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Queue'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQueueModal;
