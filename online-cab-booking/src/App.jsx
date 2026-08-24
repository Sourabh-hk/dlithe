import React, { useState } from 'react';
import Header from './components/Header';
import SearchBox from './components/SearchBox';
import CabCard from './components/CabCard';
import BookingStatus from './components/BookingStatus';
import './App.css';

const initialCabBookings = [
  {
    id: 1,
    driverName: "Rahul",
    vehicleType: "Sedan",
    vehicleNumber: "KA 01 AB 1234",
    pickupLocation: "BTM Layout",
    destination: "Electronic City",
    fare: 320,
    rating: 4.7
  },
  {
    id: 2,
    driverName: "Manoj",
    vehicleType: "Hatchback",
    vehicleNumber: "KA 05 CD 4567",
    pickupLocation: "HSR Layout",
    destination: "Koramangala",
    fare: 220,
    rating: 4.5
  },
  {
    id: 3,
    driverName: "Suresh",
    vehicleType: "SUV",
    vehicleNumber: "KA 53 XY 9988",
    pickupLocation: "Indiranagar",
    destination: "Whitefield",
    fare: 450,
    rating: 4.8
  },
  {
    id: 4,
    driverName: "Vikram",
    vehicleType: "Sedan",
    vehicleNumber: "KA 03 LM 1122",
    pickupLocation: "BTM Layout",
    destination: "Electronic City",
    fare: 330,
    rating: 4.6
  }
];

function App() {
  const [cabs] = useState(initialCabBookings);
  
  const availablePickups = [...new Set(cabs.map(cab => cab.pickupLocation))];
  const availableDestinations = [...new Set(cabs.map(cab => cab.destination))];

  const [filteredCabs, setFilteredCabs] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [bookedCab, setBookedCab] = useState(null);

  const handleSearch = (pickup, destination) => {
    const results = cabs.filter(cab => 
      cab.pickupLocation.toLowerCase().includes(pickup.toLowerCase()) &&
      cab.destination.toLowerCase().includes(destination.toLowerCase())
    );
    setFilteredCabs(results);
    setHasSearched(true);
  };

  const handleBookRide = (cab) => {
    setBookedCab(cab);
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <SearchBox 
          onSearch={handleSearch} 
          availablePickups={availablePickups} 
          availableDestinations={availableDestinations} 
        />
        
        <section className="rides-section" id="rides">
          {hasSearched && (
            <>
              <h2>Available Rides</h2>
              
              {filteredCabs.length > 0 ? (
                <div className="cabs-grid">
                  {filteredCabs.map(cab => (
                    <CabCard 
                      key={cab.id} 
                      cab={cab} 
                      onBook={handleBookRide} 
                      isBooked={bookedCab && bookedCab.id === cab.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-cabs">
                  <p>No cabs available for this route.</p>
                  <p>Please try another pickup or destination (e.g., BTM Layout to Electronic City).</p>
                </div>
              )}
            </>
          )}
        </section>
        
        <BookingStatus bookedCab={bookedCab} />
      </main>
    </div>
  );
}

export default App;
