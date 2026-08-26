import React from 'react';

const JobApplicationCard = ({ application, onDelete, onStatusChange }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      onDelete(application.id);
    }
  };

  return (
    <tr>
      <td data-label="Company" className="company-cell">{application.companyName}</td>
      <td data-label="Role" className="role-cell">{application.jobRole}</td>
      <td data-label="Date">{formatDate(application.applicationDate)}</td>
      <td data-label="Status">
        <select
          className={`table-status-select`}
          value={application.status}
          onChange={(e) => onStatusChange(application.id, e.target.value)}
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </td>
      <td data-label="Action">
        <button className="btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default JobApplicationCard;
