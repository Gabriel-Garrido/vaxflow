import axios from 'axios';

const inventarioApi = axios.create({
    baseURL: 'http://localhost:8000/inventario/api/'
});

export const getAllStock = () => {
    const token = localStorage.getItem('accessToken');
    return inventarioApi.get('/vacunasStock/', { headers: { Authorization: `Bearer ${token}` } });
};

export const getAllVacunas = () => {
    const token = localStorage.getItem('accessToken');
    return inventarioApi.get('/vacunas/', { headers: { Authorization: `Bearer ${token}` } });
};

export const getAllVacunatorios = () => {
    const token = localStorage.getItem('accessToken');
    return inventarioApi.get('/vacunatorios/', { headers: { Authorization: `Bearer ${token}` } });
};

export const createTraspaso = (traspaso) => {
    const token = localStorage.getItem('accessToken');
    return inventarioApi.post('/traspasos/', traspaso, { headers: { Authorization: `Bearer ${token}` } });
};