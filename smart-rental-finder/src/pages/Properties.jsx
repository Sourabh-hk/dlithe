import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';
import PropertyCard from '../components/PropertyCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import '../styles/properties.css';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [filters, setFilters] = useState({
    location: '',
    rent: '',
    type: '',
    bedrooms: '',
  });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/properties');
      setProperties(response.data);
    } catch (err) {
      setError('Failed to fetch properties.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term) {
      setSearchParams({ search: term });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      rent: '',
      type: '',
      bedrooms: '',
    });
    setSearchTerm('');
    setSearchParams({});
  };

  const locations = useMemo(() => {
    const locs = new Set(properties.map((p) => p.city));
    return Array.from(locs);
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search match
      const searchMatch = 
        !searchTerm || 
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter matches
      const locationMatch = !filters.location || property.city === filters.location;
      
      let rentMatch = true;
      if (filters.rent) {
        if (filters.rent === 'under_10k') rentMatch = property.rent < 10000;
        else if (filters.rent === '10k_20k') rentMatch = property.rent >= 10000 && property.rent <= 20000;
        else if (filters.rent === '20k_30k') rentMatch = property.rent >= 20000 && property.rent <= 30000;
        else if (filters.rent === 'above_30k') rentMatch = property.rent > 30000;
      }

      const typeMatch = !filters.type || property.type === filters.type;
      
      let bedMatch = true;
      if (filters.bedrooms) {
        if (filters.bedrooms === '4+') bedMatch = property.bedrooms >= 4;
        else bedMatch = property.bedrooms.toString() === filters.bedrooms;
      }

      return searchMatch && locationMatch && rentMatch && typeMatch && bedMatch;
    });
  }, [properties, searchTerm, filters]);

  return (
    <div className="properties-page page-container">
      <h1 className="section-title">Explore Properties</h1>
      
      <div className="properties-search-container">
        <SearchBar initialValue={searchTerm} onSearch={handleSearch} />
      </div>

      <div className="properties-layout">
        <aside className="filters-sidebar">
          <FilterPanel 
            filters={filters} 
            setFilters={setFilters} 
            locations={locations}
            clearFilters={clearFilters}
          />
        </aside>

        <main className="properties-main">
          <div className="results-header">
            <p className="results-count">
              Showing <strong>{filteredProperties.length}</strong> {filteredProperties.length === 1 ? 'property' : 'properties'}
            </p>
          </div>

          {loading ? (
            <Loading message="Loading properties..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchProperties} />
          ) : filteredProperties.length === 0 ? (
            <EmptyState 
              title="No properties found" 
              description="Try adjusting your search or filters to find what you're looking for."
              actionText="Clear all filters"
              onAction={clearFilters}
            />
          ) : (
            <div className="properties-grid">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Properties;
