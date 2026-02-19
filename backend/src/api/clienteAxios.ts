import axios from 'axios';

const clienteAxios = axios.create({
    // Importante: En Vite se usa import.meta.env
    baseURL: import.meta.env.VITE_API_URL 
});

export default clienteAxios;