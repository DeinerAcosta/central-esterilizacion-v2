import axios from 'axios';

// ⚠️ MODO SIN BACKEND - Cliente HTTP desactivado
// Si necesitas activar el backend, descomenta las líneas siguientes

/*
const clienteAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token en cada petición
clienteAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
*/

// Cliente simulado para modo sin backend
const clienteAxios = {
  get: async (url: string) => {
    console.warn('⚠️ Modo sin backend: GET', url);
    return Promise.resolve({ data: [] });
  },
  post: async (url: string, data: any) => {
    console.warn('⚠️ Modo sin backend: POST', url, data);
    return Promise.resolve({ data: { message: 'Operación simulada' } });
  },
  put: async (url: string, data: any) => {
    console.warn('⚠️ Modo sin backend: PUT', url, data);
    return Promise.resolve({ data: { message: 'Operación simulada' } });
  },
  delete: async (url: string) => {
    console.warn('⚠️ Modo sin backend: DELETE', url);
    return Promise.resolve({ data: { message: 'Operación simulada' } });
  },
};

export default clienteAxios;
