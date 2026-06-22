import api from "./axios";

export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const signupUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  const response = await api.post("/auth/signup", {
    fullName,
    email,
    password,
  });

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};