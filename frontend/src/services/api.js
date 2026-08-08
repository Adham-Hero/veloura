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

export default api;
