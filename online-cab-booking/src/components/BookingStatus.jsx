import React from 'react';

class BookingStatus extends React.Component {
  render() {
    const { bookedCab } = this.props;

    return (
      <div className="booking-status-section" id="booking">
        <h2>My Booking</h2>
        
        {!bookedCab ? (
          <div className="no-booking">
            <p>No ride booked yet.</p>
          </div>
        ) : (
          <div className="booking-success">
            <h3>✓ Ride Booked Successfully!</h3>
            
            <div className="booking-details">
              <p><strong>Driver:</strong> {bookedCab.driverName}</p>
              <p><strong>Vehicle:</strong> {bookedCab.vehicleType} ({bookedCab.vehicleNumber})</p>
              <p><strong>Pickup:</strong> {bookedCab.pickupLocation}</p>
              <p><strong>Destination:</strong> {bookedCab.destination}</p>
              <p><strong>Fare:</strong> ₹{bookedCab.fare}</p>
            </div>
            
            <p className="arrival-msg">Your driver will arrive shortly.</p>
          </div>
        )}
      </div>
    );
  }
}

export default BookingStatus;
