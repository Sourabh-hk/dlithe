import { createContext, useState, useEffect, useCallback } from 'react';

export const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState(() => {
    try {
      const stored = localStorage.getItem('smart-rental-favourites');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load favourites from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('smart-rental-favourites', JSON.stringify(favourites));
    } catch (error) {
      console.error('Failed to save favourites to localStorage', error);
    }
  }, [favourites]);

  const addFavourite = useCallback((property) => {
    setFavourites((prev) => {
      if (prev.some((p) => p.id === property.id)) return prev;
      return [...prev, property];
    });
  }, []);

  const removeFavourite = useCallback((propertyId) => {
    setFavourites((prev) => prev.filter((p) => p.id !== propertyId));
  }, []);

  const toggleFavourite = useCallback((property) => {
    setFavourites((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      } else {
        return [...prev, property];
      }
    });
  }, []);

  const isFavourited = useCallback(
    (propertyId) => {
      return favourites.some((p) => p.id === propertyId);
    },
    [favourites]
  );

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        addFavourite,
        removeFavourite,
        toggleFavourite,
        isFavourited,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};
