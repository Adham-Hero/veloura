import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Attach the JWT token (if present) to every request
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("veloura_user");
  if (storedUser) {
    try {
      const { token } = JSON.parse(storedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore malformed storage
    }
  }
  return config;
});

// Attach a clear, consistent message when the request never reached the server
// (wrong API URL, CORS block, server down, etc.) instead of letting pages fall
// back to a misleading default message like "invalid credentials".
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.isNetworkError = true;
      error.friendlyMessage =
        "Could not reach the server. Check that VITE_API_URL is correct and the backend is running.";
    }
    return Promise.reject(error);
  }
);

export default api;
