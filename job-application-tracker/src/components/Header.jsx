import React from 'react';

const Header = ({ onAddClick }) => {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-title-container">
          <h1>Job Application Tracker</h1>
          <p>Keep track of your applications and stay organized.</p>
        </div>
        <button className="btn-primary" onClick={onAddClick}>
          + Add Application
        </button>
      </div>
    </header>
  );
};

export default Header;
