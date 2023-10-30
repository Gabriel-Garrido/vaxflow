import React, { useState } from 'react';
import { login, logout } from '../api/authentication';
import { useAuth } from '../AuthContext';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false); // Nuevo estado para el procesamiento
  const { setIsAuthenticated, setUser } = useAuth();

  logout()


  const handleLogin = async () => {
    try {
      setProcessing(true); // Iniciar el proceso de inicio de sesión
      const response = await login({ username, password });
      if (response) {
        localStorage.setItem('user', JSON.stringify(username));
        setIsAuthenticated(true);
        setUser(username);
        window.location.reload()
      }

    } catch (error) {
      setProcessing(false); // Finalizar el proceso de inicio de sesión (éxito o fallo)
      return setError('Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    handleLogin();
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card bg-dark text-white">
            <div className="card-header">Login</div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username" className="text-light">
                    Username
                  </label>
                  <input
                    id="username"
                    className="form-control"
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="password" className="text-light">
                    Password
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center mt-3">
                  <button className="btn btn-primary" type="submit" disabled={processing}>
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Loading...
                      </>
                    ) : (
                      'Login'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
