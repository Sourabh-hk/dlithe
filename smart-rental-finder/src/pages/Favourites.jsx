import { useContext } from 'react';
import { FavouritesContext } from '../context/FavouritesContext';
import PropertyCard from '../components/PropertyCard';
import EmptyState from '../components/EmptyState';
import '../styles/favourites.css';

const Favourites = () => {
  const { favourites } = useContext(FavouritesContext);

  return (
    <div className="favourites-page page-container">
      <div className="section-header">
        <h1 className="section-title">My Favourites</h1>
        <p className="favourites-count">
          {favourites.length} {favourites.length === 1 ? 'property' : 'properties'} saved
        </p>
      </div>

      {favourites.length === 0 ? (
        <EmptyState 
          title="No favourites yet"
          description="You haven't added any properties to your favourites yet. Start exploring properties to find your dream home."
          actionText="Browse Properties"
          actionLink="/properties"
        />
      ) : (
        <div className="properties-grid">
          {favourites.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
