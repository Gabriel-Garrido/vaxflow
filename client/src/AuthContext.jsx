import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserDetails } from './api/authentication';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)


  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('accessToken');
    
    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser && savedToken.trim() !== '') {
        setUser(parsedUser);
        setIsAuthenticated(true)
        ;
      } else {
        localStorage.clear()
        setIsAuthenticated(false)

      }
    } else {
      localStorage.clear();
      setIsAuthenticated(false)

    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, userDetails, setUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}