import { X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{ width: '90%', maxWidth: '400px', backgroundColor: 'var(--bg-color)', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', color: 'var(--text-light)' }}
        >
          <X size={20} />
        </button>
        
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p className="text-light" style={{ marginBottom: '1.5rem' }}>{message}</p>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
