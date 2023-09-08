import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserDetails } from './api/authentication';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const userDetailsData = await getUserDetails();
      if (userDetailsData) {
        setIsAuthenticated(true);
        setUserDetails(userDetailsData);
      }
    } catch (error) {
      console.error('-----error en fetchUserDetails------')
      // Maneja errores de obtención de userDetails si es necesario
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('accessToken');

    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser && savedToken.trim() !== '') {
        setUser(parsedUser);
        setIsAuthenticated(true);
        fetchUserDetails(); // Obtiene userDetails al iniciar sesión
      } else {
        localStorage.clear();
        setIsAuthenticated(false);
      }
    } else {
      localStorage.clear();
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, userDetails, setUserDetails, fetchUserDetails}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
