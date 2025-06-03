import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "localhost:3001";

const axiosInstance = axios.create({
  baseURL: `${window.location.protocol}//${apiUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
