import React from 'react';

const StatusFilter = ({ statusFilter, onStatusFilterChange }) => {
  return (
    <div className="filter-container">
      <label htmlFor="statusFilter">Filter:</label>
      <select
        id="statusFilter"
        className="status-select"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  );
};

export default StatusFilter;
