import axios from 'axios';

// Ajusta el puerto aquí según tu launchSettings.json (veo que usas 7069 para HTTPS)
const BASE_URL = 'https://localhost:7069/api';

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true // ¡IMPORTANTE! Permite enviar/recibir Cookies de sesión
});