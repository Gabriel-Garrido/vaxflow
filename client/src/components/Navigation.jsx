import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/authentication';

export function Navigation({ isAuthenticated, handleLogin }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    handleLogin({ username: '', password: '' }); // Limpia el estado de autenticación en el contexto
    navigate('/login'); // Redirige a la página de login
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
