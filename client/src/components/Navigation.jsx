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

<nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid d-flex">
    <h1 className="navbar-brand"><Link to="/">VaxFlow</Link></h1>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
      {isAuthenticated ? (
          <>
            <li className="nav-item"><Link to="/traspaso" className="nav-link active" aria-current="page">Nuevo traspaso</Link></li>
            <div className="dropdown">
              <a className="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fa-solid fa-user"></i> {user} 
              </a>
              <ul className="dropdown-menu ">
                <li><Link to="/change-password" className="dropdown-item" aria-current="page">Change Password</Link></li>
                <li><hr class="dropdown-divider"/></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          </>

        ) : (
          <nav className="navbar bg-body-tertiary">
            <button className="btn btn-outline-success me-2 justify-content-end" type="button"><Link to="/login" className="nav-link active" aria-current="page">Login</Link></button>
        </nav>
        )}
      </ul>
    </div>
  </div>
</nav>
  );
}