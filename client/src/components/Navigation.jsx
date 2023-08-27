import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/authentication';
import { useAuth } from '../AuthContext';

export function Navigation() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false); // Cambiar el estado de autenticación en el contexto
    localStorage.clear()
    navigate('/login'); // Redirigir a la página de login
  };

  return (
    <nav>
      <ul>
        <li>
          <h1><Link to="/">VaxFlow</Link></h1>
        </li>
        {isAuthenticated ? (
          <>
            <li><Link to="/traspaso">Traspaso</Link></li>
            <li><Link to="/change-password">Change Password</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}