import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserDetails, logout } from './api/authentication';
import { getAllStock } from './api/inventario';


const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [stock, setStock] = useState([]);


  const fetchUserDetails = async () => {
    try {
      const userDetailsData = await getUserDetails();
      if (userDetailsData) {
        setIsAuthenticated(true);
        setUserDetails(userDetailsData);
      }
    } catch (error) {
      console.error('-----error en fetchUserDetails------')
      logout();
      setIsAuthenticated(false);
      window.location.reload()
      // Maneja errores de obtención de userDetails si es necesario
    }
  };

  const fetchStock = async () => {
    try {
      // Verificar si userDetails está disponible antes de continuar
      if (!userDetails) {
        return;
      }

      const response = await getAllStock();
      setStock(response.data);
    } catch (error) {
      console.error('Error fetching stock:', error);
      if (error.response && error.response.status === 401) {
        logout();
        setIsAuthenticated(false);
      }
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('accessToken');

    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser && savedToken.trim() !== '') {
        setIsAuthenticated(true);
        setUser(parsedUser);
        fetchUserDetails(); // Obtiene userDetails al iniciar sesión
      } else {
        logout();
        setIsAuthenticated(false);

      }
    } else {
      logout();
      setIsAuthenticated(false);

    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, userDetails, setUserDetails, fetchUserDetails, fetchStock, stock}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
