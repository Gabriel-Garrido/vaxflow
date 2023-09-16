import axios from 'axios';

const inventarioApi = axios.create({
    baseURL: 'http://localhost:8000/inventario/api/'
});

export const getAllStock = () => {
    try {
        const token = localStorage.getItem('accessToken');
        return inventarioApi.get('/vacunasStock/', { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        // Aquí puedes manejar el error, por ejemplo, registrándolo en la consola
        console.error('Error en getAllStock:', error);
        
        throw error; // Puedes relanzar el error para que sea manejado por quien llame a esta función
    }
};

export const getAllVacunas = () => {
    try{
        const token = localStorage.getItem('accessToken');
        return inventarioApi.get('/vacunas/', { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        // Aquí puedes manejar el error, por ejemplo, registrándolo en la consola
        console.error('Error en getAllVacunas:', error);
        throw error; // Puedes relanzar el error para que sea manejado por quien llame a esta función
    }

};

export const getAllVacunatorios = () => {
    try{
        const token = localStorage.getItem('accessToken');
        return inventarioApi.get('/vacunatorios/', { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        // Aquí puedes manejar el error, por ejemplo, registrándolo en la consola
        console.error('Error en getAllVacunatorios:', error);
        throw error; // Puedes relanzar el error para que sea manejado por quien llame a esta función
    }
};

export const createTraspaso = (traspaso) => {
    try{
        const token = localStorage.getItem('accessToken');
        return inventarioApi.post('/traspasos/', traspaso, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        // Aquí puedes manejar el error, por ejemplo, registrándolo en la consola
        console.error('Error en createTraspaso:', error);
        throw error; // Puedes relanzar el error para que sea manejado por quien llame a esta función
    }
};

export const getAllUsuariosByVacunatorioId = (vacunatorioId) => {
    try{
        const token = localStorage.getItem('accessToken');
        return inventarioApi.get(`/usuarios/vacunatorio/${vacunatorioId}/`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        // Aquí puedes manejar el error, por ejemplo, registrándolo en la consola
        console.error('Error en getAllUsuariosByVacunatorioId:', error);
        throw error; // Puedes relanzar el error para que sea manejado por quien llame a esta función
    }
};

export const getAllTraspasos = () => {
    try {
        const token = localStorage.getItem('accessToken');
        return inventarioApi.get('/traspasos/', { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        console.error('Error en getAllTraspasos:', error);
        throw error;
    }
};

export const createEliminacionVacuna = async (eliminacionVacunaData) => {
    try {
        const token = localStorage.getItem('accessToken');
        await inventarioApi.post('/eliminaciones/', eliminacionVacunaData, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        console.error('Error en createEliminacionVacuna:', error);
        throw error;
    }
};

export const createAdministracionVacuna = async (administracionVacunaData) => {
    try {
        const token = localStorage.getItem('accessToken');
        await inventarioApi.post('/administraciones/', administracionVacunaData, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        console.error('Error en createAdministracionVacuna:', error);
        throw error;
    }
};

export const getAllEliminaciones = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        return inventarioApi.get('/eliminaciones/', { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        console.error('Error en getAllEliminaciones:', error);
        throw error;
    }
};
