import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // Required for the httpOnly auth cookie to be sent on cross-origin requests.
  // The server must respond with Access-Control-Allow-Origin (exact origin, not *)
  // and Access-Control-Allow-Credentials: true for this to work.
  withCredentials: true,
});

export default api;