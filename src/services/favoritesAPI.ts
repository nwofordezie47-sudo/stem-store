import api from "./axios";

export const getFavorites = async () => {
  const response = await api.get("/favorites");
  return response.data;
};

export const addFavorite = async (stemId: string) => {
  const response = await api.post(`/favorites/${stemId}`);
  return response.data;
};

export const removeFavorite = async (stemId: string) => {
  const response = await api.delete(`/favorites/${stemId}`);
  return response.data;
};
