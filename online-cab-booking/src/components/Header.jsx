import React from 'react';


function Header() {
  return (
    <header className="header">
      <div className="logo">QuickCab</div>
      <nav className="nav-links">
        <a href="#home">Home</a>
        <a href="#rides">Rides</a>
        <a href="#booking">My Booking</a>
      </nav>
    </header>
  );
}

export default Header;
