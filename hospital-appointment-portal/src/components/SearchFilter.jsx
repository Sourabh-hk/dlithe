import React from 'react';
import { Search, Filter } from 'lucide-react';
import './SearchFilter.css';

const SearchFilter = ({ searchTerm, onSearchChange, specialization, onSpecializationChange, specializations = [] }) => {
  return (
    <div className="search-filter-container">
      <div className="search-box">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Search doctors by name or specialization..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="filter-box">
        <Filter className="filter-icon" size={20} />
        <select 
          className="filter-select"
          value={specialization}
          onChange={(e) => onSpecializationChange(e.target.value)}
        >
          <option value="">All Specializations</option>
          {specializations.map((spec, index) => (
            <option key={index} value={spec}>{spec}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;
