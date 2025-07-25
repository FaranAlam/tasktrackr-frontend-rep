// src/utils/api.js
import axios from "axios";

// Create an Axios instance with base URL from Vite env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // Not needed for JWT
});

// Automatically attach token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
