import React, { useState, useEffect, useMemo } from 'react';
import { doctors } from '../data/doctors';
import DoctorCard from '../components/DoctorCard';
import SearchFilter from '../components/SearchFilter';
import EmptyState from '../components/EmptyState';
import { SearchX } from 'lucide-react';
import './Doctors.css';

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const specializations = useMemo(() => {
    const specs = new Set(doctors.map(doc => doc.specialization));
    return Array.from(specs).sort();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpec = specialization === '' || doc.specialization === specialization;
      return matchesSearch && matchesSpec;
    });
  }, [searchTerm, specialization]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSpecialization('');
  };

  return (
    <div className="page-container container">
      <div className="doctors-header">
        <h1 className="page-title">Find a Doctor</h1>
        <p className="page-subtitle">Search and book appointments with our expert doctors.</p>
      </div>

      <SearchFilter 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        specialization={specialization}
        onSpecializationChange={setSpecialization}
        specializations={specializations}
      />

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading doctors...</p>
        </div>
      ) : (
        <>
          {filteredDoctors.length > 0 ? (
            <div className="grid grid-3 doctors-grid">
              {filteredDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={SearchX}
              title="No doctors found"
              description="We couldn't find any doctors matching your search or filter criteria."
              actionText="Clear Filters"
              onAction={handleClearFilters}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Doctors;
