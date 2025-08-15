import axios from "./axios";

export const getFavoritesRequest = () => axios.get("/favorites");

export const addFavoriteRequest = (productId) =>
  axios.post(`/favorites/${productId}`);

export const removeFavoriteRequest = (productId) =>
  axios.delete(`/favorites/${productId}`);
