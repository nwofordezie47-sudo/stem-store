import api from "./axios";

export const initializePayment = async (stemId: string) => {
  const response = await api.post("/payments/initialize", {
    stemId,
  });

  return response.data;
};

export const verifyPayment = async (reference: string) => {
  const response = await api.get(`/payments/verify/${reference}`);
  return response.data;
};