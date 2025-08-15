import { createContext, useContext, useState, useEffect } from "react";
import {
  getFavoritesRequest,
  addFavoriteRequest,
  removeFavoriteRequest,
} from "../api/favorites";

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const getFavorites = async () => {
    try {
      const res = await getFavoritesRequest();
      setFavorites(res.data || []);
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
    }
  };

  const addFavorite = async (productId) => {
    try {
      await addFavoriteRequest(productId);
      await getFavorites();
    } catch (error) {
      console.error("Error al agregar favorito:", error);
    }
  };

  const removeFavorite = async (productId) => {
    try {
      await removeFavoriteRequest(productId);
      await getFavorites();
    } catch (error) {
      console.error("Error al quitar favorito:", error);
    }
  };

  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount: favorites.length,
        addFavorite,
        removeFavorite,
        getFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
