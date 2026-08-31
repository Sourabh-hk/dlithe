import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import '../styles/search-bar.css';

const SearchBar = ({ initialValue = '', onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/properties?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by property name, city, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <button type="submit" className="btn-primary search-btn">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
