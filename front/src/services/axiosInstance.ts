// src/api/axiosInstance.js
import axios from 'axios';

const apiUrl: string = import.meta.env.VITE_API_URL || 'localhost:3001';
const axiosInstance = axios.create({
   baseURL: `${window.location.protocol}//${apiUrl}/api`, // Reemplazá con la URL de tu backend si es otra
   headers: {
      'Content-Type': 'application/json',
      token: localStorage.getItem('token') || '', // Agrega el token de autenticación si está disponible
   },
   // También podés agregar otras configs si querés
});

export default axiosInstance;
