import api from "./axios";

export const getMyPurchases = async () => {
  const response = await api.get("/purchases");
  return response.data;
};

export const downloadStem = async (stemId: string) => {
  const response = await api.get(`/purchases/${stemId}/download`);
  return response.data;
};
