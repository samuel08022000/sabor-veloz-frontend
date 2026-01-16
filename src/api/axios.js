import axios from 'axios';

// Esto es lo que hace la magia:
// Dice: "Si existe una variable de entorno en la nube, úsala. Si no, usa localhost."
const BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7069/api';

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true 
});