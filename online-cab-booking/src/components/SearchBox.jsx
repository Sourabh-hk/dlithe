import React, { useState } from 'react';

function SearchBox({ onSearch, availablePickups = [], availableDestinations = [] }) {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (!pickup.trim() || !destination.trim()) {
      setError("Please select both pickup and destination.");
      return;
    }
    setError("");
    onSearch(pickup, destination);
  };

  return (
    <div className="search-section" id="home">
      <h2>Book Your Ride</h2>
      <p>Find a comfortable cab and reach your destination safely.</p>
      
      <div className="search-box">
        <div className="input-group">
          <label>Pickup Location</label>
          <select value={pickup} onChange={(e) => setPickup(e.target.value)}>
            <option value="">Select Pickup Location</option>
            {availablePickups.map((loc, index) => (
              <option key={index} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Destination</label>
          <select value={destination} onChange={(e) => setDestination(e.target.value)}>
            <option value="">Select Destination</option>
            {availableDestinations.map((loc, index) => (
              <option key={index} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <button className="search-btn" onClick={handleSearch}>Search Rides</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default SearchBox;
