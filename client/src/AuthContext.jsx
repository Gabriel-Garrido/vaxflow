import React, { createContext, useContext, useState } from 'react';
import { login, isAuthenticated as checkIsAuthenticated } from './api/authentication';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(checkIsAuthenticated());

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
