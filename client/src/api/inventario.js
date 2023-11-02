import axios from 'axios';

//  const baseURL = 'http://localhost:8000/inventario/api/';

const baseURL = 'https://vaxflowapi.onrender.com/inventario/api/' || 'http://localhost:8000/inventario/api/';

const inventarioApi = axios.create({
    baseURL,
    timeout: 100000,
});

// Función para obtener todas las vacunas
export const getAllVacunas = () => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.get('/vacunas/', { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en getAllVacunas:', error);
      throw error;
    }
  };
  
  // Función para crear una nueva vacuna
  export const createVacuna = (vacunaData) => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.post('/vacunas/', vacunaData, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en createVacuna:', error);
      throw error;
    }
  };
  
  // Función para obtener todos los vacunatorios
  export const getAllVacunatorios = () => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.get('/vacunatorios/', { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en getAllVacunatorios:', error);
      throw error;
    }
  };
  
  // Función para crear un nuevo traspaso de vacuna
  export const createTraspaso = (traspasoData) => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.post('/traspaso-vacuna/', traspasoData, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en createTraspaso:', error);
      throw error;
    }
  };
  
  // Otras funciones que necesitas
  
  // Función para obtener todos los traspasos de vacunas
  export const getAllTraspasos = () => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.get('/traspaso-vacuna/', { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en getAllTraspasos:', error);
      throw error;
    }
  };
  
  // Función para crear una eliminación de vacuna
  export const createEliminacionVacuna = (eliminacionData) => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.post('/eliminacion-vacuna/', eliminacionData, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en createEliminacionVacuna:', error);
      throw error;
    }
  };
  
  // Función para crear una administración de vacuna
  export const createAdministracionVacuna = (administracionData) => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.post('/administracion-vacuna/', administracionData, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en createAdministracionVacuna:', error);
      throw error;
    }
  };
  
  // Función para obtener todas las eliminaciones de vacunas
  export const getAllEliminaciones = () => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.get('/eliminacion-vacuna/', { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en getAllEliminaciones:', error);
      throw error;
    }
  };
  
  // Función para obtener todas las administraciones de vacunas
  export const getAllAdministraciones = () => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.get('/administracion-vacuna/', { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en getAllAdministraciones:', error);
      throw error;
    }
  };
  
  // Función para obtener todos los retiros de cámara
  export const getAllRetirosCamara = () => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.get('/retiro-camara/', { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en getAllRetirosCamara:', error);
      throw error;
    }
  };
  
  // Función para crear un retiro de cámara
  export const createRetiroCamara = (retiroCamaraData) => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.post('/retiro-camara/', retiroCamaraData, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en createRetiroCamara:', error);
      throw error;
    }
  };
  
  // Función para obtener todos los elementos del inventario de vacunas
  export const getAllInventarioVacuna = () => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.get('/inventario-vacuna/', { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en getAllInventarioVacuna:', error);
      throw error;
    }
  };
  
  // Función para obtener elementos del inventario de vacunas por fecha
  export const getInventarioVacunaPorFecha = (fecha) => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.get(`/inventario-vacuna/${fecha}/`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en getInventarioVacunaPorFecha:', error);
      throw error;
    }
  };
  
  // Función para crear un elemento en el inventario de vacunas
  export const createInventarioVacuna = (inventarioVacunaData) => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.post('/inventario-vacuna/', inventarioVacunaData, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en createInventarioVacuna:', error);
      throw error;
    }
  };

  export const getAllUsuariosByVacunatorioId = (vacunatorioId) => {
    try {
      const token = localStorage.getItem('accessToken');
      return inventarioApi.get(`/usuarios/vacunatorio/${vacunatorioId}/`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Error en getAllUsuariosByVacunatorioId:', error);
      throw error;
    }
  };
  