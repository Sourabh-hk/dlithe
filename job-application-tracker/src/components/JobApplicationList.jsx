import React from 'react';
import JobApplicationCard from './JobApplicationCard';

const JobApplicationList = ({ applications, onDelete, onStatusChange }) => {
  return (
    <div className="applications-section">
      <div className="applications-header">
        <h2>My Applications</h2>
      </div>
      <div className="table-container">
        <table className="applications-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <JobApplicationCard
                key={app.id}
                application={app}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobApplicationList;
