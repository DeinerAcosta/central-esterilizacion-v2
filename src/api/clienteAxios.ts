import axios from 'axios';

// VITE_API_URL es la variable que pusiste en tus archivos .env
const clienteAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL 
});

export default clienteAxios;