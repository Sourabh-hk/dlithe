import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { FiCheckCircle } from 'react-icons/fi';
import '../styles/home.css';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/properties?_limit=3');
      setFeaturedProperties(response.data);
    } catch (err) {
      setError('Failed to load featured properties.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find a place that feels like home.</h1>
          <p>Discover the best rental properties in your favorite cities.</p>
          <div className="hero-search-wrapper">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="featured-section page-container">
        <div className="section-header">
          <h2 className="section-title">Featured Properties</h2>
          <Link to="/properties" className="btn-outline view-all-btn">
            Explore All Properties
          </Link>
        </div>

        {loading ? (
          <Loading message="Loading featured properties..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchFeatured} />
        ) : (
          <div className="properties-grid">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="page-container">
          <h2 className="section-title text-center">Why Choose Us?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <FiCheckCircle className="benefit-icon" />
              <h3>Verified Listings</h3>
              <p>Every property on our platform is verified for your safety and peace of mind.</p>
            </div>
            <div className="benefit-card">
              <FiCheckCircle className="benefit-icon" />
              <h3>Easy Search</h3>
              <p>Advanced filters to help you find exactly what you are looking for.</p>
            </div>
            <div className="benefit-card">
              <FiCheckCircle className="benefit-icon" />
              <h3>Simple Process</h3>
              <p>Contact property owners directly and manage all your enquiries in one place.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
