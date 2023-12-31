import axios from 'axios';


// const baseURL ='http://localhost:8000/auth/';
const baseURL = 'https://vaxflowapi.onrender.com/auth/' || 'http://localhost:8000/auth/';

const authApi = axios.create({
    baseURL,
    timeout: 100000,
});

// Función para realizar el inicio de sesión
export const login = async (credentials) => {
  try {
    const response = await authApi.post('token/', credentials);
    const token = response.data.access;

    // Almacenar el token en el almacenamiento local
    localStorage.setItem('accessToken', token);

    // Configurar el token en las cabeceras para futuras solicitudes
    authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return response;
  } catch (error) {
    // Manejar errores de inicio de sesión
    throw error;
  }
};

// Función para obtener los detalles del usuario
export const getUserDetails = async () => {
  try {
    const response = await authApi.get('user/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        // Token inválido o expirado, realizar alguna acción aquí, por ejemplo, logout.
        logout();
      } else {
        // Otro tipo de error en la respuesta del servidor, puedes manejarlo aquí.
        console.error('Error en la respuesta del servidor:', error.response.data);
      }
    } else if (error.request) {
      // Error de red, el backend no está disponible.
      console.error('Error de red, el servidor no está disponible:', error.request);
    } else {
      // Otros tipos de errores.
      console.error('Error:', error.message);
    }
    throw error;
  }
};

// Función para cerrar la sesión
export const logout = () => {
  // Eliminar el token y otros datos relacionados con la sesión
  localStorage.clear()
  delete authApi.defaults.headers.common['Authorization'];

  return authApi.post('logout/');
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return localStorage.getItem('accessToken') !== null;
};

export const changePassword = (newPassword) => authApi.post('change-password/', newPassword);
