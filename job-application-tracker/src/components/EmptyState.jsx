import React from 'react';

const EmptyState = ({ onAddClick, hasSearchOrFilter }) => {
  return (
    <div className="empty-state">
      {hasSearchOrFilter ? (
        <>
          <h3>No matching applications</h3>
          <p>Try changing your search or filter.</p>
        </>
      ) : (
        <>
          <h3>No applications yet</h3>
          <p>Start tracking your job applications by adding your first application.</p>
          <button className="btn-primary" onClick={onAddClick}>
            + Add Application
          </button>
        </>
      )}
    </div>
  );
};

export default EmptyState;
