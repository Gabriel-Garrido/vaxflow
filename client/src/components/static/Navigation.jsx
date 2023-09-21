import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../api/authentication';
import { useAuth } from '../../AuthContext';
import { Recepcion } from '../recepciones/Recepcion';
import { RecepcionCamara } from '../recepciones/RecepcionCamara';

export function Navigation() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, user, setUser, userDetails, stock } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (isAuthenticated) {
      if (userDetails != null) {
        setLoading(false);
      }
    }
  }, [userDetails, isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('user', 'accessToken');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login'); // Redirigir a la página de login
  };

  return (
    <nav className="navbar navbar-expand bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container-fluid text-success">
        <h1 className="navbar-brand d-none d-sm-block">
          <Link className="text-decoration-none fs-5 text-success" to="/">
            <i className="fa-solid fa-syringe fs-4"></i> VaxFlow
          </Link>
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
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                {!loading && (
                  <>
                    <li className="nav-item p-sm-2">
                      <Recepcion userDetails={userDetails} stock={stock} size="yourSize" />
                    </li>
                    <li className="nav-item p-sm-2">
                      <RecepcionCamara userDetails={userDetails} stock={stock} size="yourSize" />
                    </li>
                  </>
                )}
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
        
        {isAuthenticated && (
          <ul className="navbar-nav ms-auto d-sm-block d-none">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-decoration-none fs-6 text-white"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fa-solid fa-user fs-4"></i> {user}
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
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>     
            </li>
          </ul>
        )}
            <button className="btn btn-outline nav-item d-sm-none" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket fs-4"></i>
                  </button>
      </div>
    </nav>
  );
}
