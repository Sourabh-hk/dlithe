import '../styles/filter-panel.css';

const FilterPanel = ({ filters, setFilters, locations, clearFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button type="button" className="clear-filters-btn" onClick={clearFilters}>
          Clear All
        </button>
      </div>

      <div className="filter-group">
        <label htmlFor="location">Location</label>
        <select
          id="location"
          name="location"
          value={filters.location}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">Any Location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="rent">Rent (per month)</label>
        <select
          id="rent"
          name="rent"
          value={filters.rent}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">Any Price</option>
          <option value="under_10k">Below ₹10,000</option>
          <option value="10k_20k">₹10,000 - ₹20,000</option>
          <option value="20k_30k">₹20,000 - ₹30,000</option>
          <option value="above_30k">Above ₹30,000</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="type">Property Type</label>
        <select
          id="type"
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">Any Type</option>
          <option value="Apartment">Apartment</option>
          <option value="Independent House">Independent House</option>
          <option value="Villa">Villa</option>
          <option value="Studio">Studio</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="bedrooms">Bedrooms</label>
        <select
          id="bedrooms"
          name="bedrooms"
          value={filters.bedrooms}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">Any</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4+">4+ BHK</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
