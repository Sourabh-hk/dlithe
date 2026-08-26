import React from 'react';

const StatsCards = ({ total, applied, interview, offer, rejected }) => {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>Total Applications</h3>
        <div className="stat-value">{total}</div>
      </div>
      <div className="stat-card">
        <h3>Applied</h3>
        <div className="stat-value">{applied}</div>
      </div>
      <div className="stat-card">
        <h3>Interview</h3>
        <div className="stat-value">{interview}</div>
      </div>
      <div className="stat-card">
        <h3>Offer</h3>
        <div className="stat-value">{offer}</div>
      </div>
      <div className="stat-card">
        <h3>Rejected</h3>
        <div className="stat-value">{rejected}</div>
      </div>
    </div>
  );
};

export default StatsCards;
