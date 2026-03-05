import clienteAxios from '../api/axiosConfig';

export const authService = {
    login: async (email: string, password: string) => {
        const respuesta = await clienteAxios.post('/auth/login', { email, password });
        return respuesta.data;
    },
    recover: async (email: string) => {
        const respuesta = await clienteAxios.post('/auth/recover', { email });
        return respuesta.data;
    },
    changePassword: async (email: string, passwordActual: string, nuevaPassword: string) => {
        const respuesta = await clienteAxios.post('/auth/change-password', { 
            email, 
            passwordActual, 
            nuevaPassword 
        });
        return respuesta.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }
};