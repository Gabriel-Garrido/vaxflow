import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserDetails, logout } from './api/authentication';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('accessToken');

      console.log(savedUser);

      if (savedUser && savedToken) {
        const parsedUser = JSON.parse(savedUser);

        try {
          const userDetailsData = await getUserDetails();
  
          if (userDetailsData) {
            setUserDetails(userDetailsData);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error en fetchUserDetails:', error);
          logout();
          setIsAuthenticated(false);
          // Maneja errores de obtención de userDetails si es necesario
        }

        if (parsedUser && savedToken.trim() !== '') {
          setIsAuthenticated(true);
          setUser(parsedUser);
        }
      }

      

      setLoading(false);
    };

    loadUserData();
  }, [user, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, userDetails, setUserDetails }}>
      {loading ? <div>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
