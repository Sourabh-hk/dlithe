import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => { setToast(null); }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '1rem', right: '1rem',
          backgroundColor: toast.type === 'success' ? 'var(--success)' : 'var(--danger)',
          color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)', zIndex: 1000, display: 'flex', alignItems: 'center',
          gap: '0.5rem', fontWeight: 500, animation: 'slideIn 0.3s ease-out forwards'
        }}>
          {toast.message}
        </div>
      )}
      <style>{`@keyframes slideIn { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </ToastContext.Provider>
  );
};
