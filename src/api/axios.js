import axios from 'axios';

// Detectamos si estamos en Railway o local
// OJO: Si en Railway la variable VITE_API_URL no tiene "/api" al final, aquí se lo agregamos por seguridad.
const apiUrl = import.meta.env.VITE_API_URL || 'https://localhost:7069';
const BASE_URL = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true // 👈 ESTO ES OBLIGATORIO, NO LO BORRES
});