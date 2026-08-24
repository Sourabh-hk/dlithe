import React from 'react';

function CabCard({ cab, onBook, isBooked }) {
  return (
    <div className="cab-card">
      <div className="cab-header">
        <h3>🚕 {cab.vehicleType}</h3>
        <span className="rating">⭐ {cab.rating}</span>
      </div>
      
      <p><strong>Driver:</strong> {cab.driverName}</p>
      <p className="vehicle-no"><strong>Vehicle No:</strong> {cab.vehicleNumber}</p>
      
      <div className="locations">
        <div className="location-box">
          <small>Pickup</small>
          <p>{cab.pickupLocation}</p>
        </div>
        <div className="location-box">
          <small>Destination</small>
          <p>{cab.destination}</p>
        </div>
      </div>
      
      <p className="fare"><strong>Fare:</strong> ₹{cab.fare}</p>
      
      <button 
        className={isBooked ? "book-btn booked" : "book-btn"} 
        onClick={() => onBook(cab)}
        disabled={isBooked}
      >
        {isBooked ? "Booked" : "Book Ride"}
      </button>
    </div>
  );
}

export default CabCard;
