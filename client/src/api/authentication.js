import axios from 'axios';

const authApi = axios.create({
  baseURL: 'http://localhost:8000/auth/',
});

export const login = async (credentials) => {
  try {
    const response = await authApi.post('token/', credentials);
    const token = response.data.access;
    localStorage.setItem('accessToken', token);
    authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return response
  } catch (error) {
    throw error;
  }
};

export const getUserDetails = async () => {
  try {
    const response = await authApi.get('user/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
    });
    return response.data;
  } catch (error) {
    logout()
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken', 'user');
  delete authApi.defaults.headers.common['Authorization'];
  return authApi.post('logout/');
};

export const changePassword = (newPassword) => authApi.post('change-password/', newPassword);

export const isAuthenticated = () => {
  return localStorage.getItem('accessToken') !== null;
};