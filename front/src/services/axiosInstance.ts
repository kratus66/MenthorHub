// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
   baseURL: '/api', // Reemplazá con la URL de tu backend si es otra
   // También podés agregar otras configs si querés
});

// Ejemplo opcional de interceptor de request para token
/*
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // o donde guardes tu auth token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});
*/

export default axiosInstance;
