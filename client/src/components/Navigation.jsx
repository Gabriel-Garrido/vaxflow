import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/authentication';
import { useAuth } from '../AuthContext';

export function Navigation() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, user, setUser} = useAuth();

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('user', 'accessToken');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login'); // Redirigir a la página de login
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <div className="container">
        <h1 className="navbar-brand">
          <Link to="/">VaxFlow</Link>
        </h1>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/traspaso" className="nav-link">
                    Nuevo traspaso
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa-solid fa-user"></i> {user}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/change-password" className="dropdown-item">
                        Change Password
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}