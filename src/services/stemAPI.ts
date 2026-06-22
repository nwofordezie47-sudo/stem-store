import api from "./axios";

export const getAllStems = async (params?: {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get("/stems", { params });
  return response.data;
};

export const getStemById = async (
  id: string
) => {
  const response = await api.get(`/stems/${id}`);
  return response.data;
};