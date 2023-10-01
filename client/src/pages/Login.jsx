import React, { useState } from 'react';
import { login } from '../api/authentication';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export function Login(isAuthenticated) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth();

  useEffect(() =>{
    if (isAuthenticated) {
      navigate(home)
    }
  })

  const handleLogin = async () => {
    try {
      const response = await login({ username, password });
      if (response) {
        localStorage.setItem('user', JSON.stringify(username));
        setIsAuthenticated(true);
        setUser(username);
        window.location.reload();      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card bg-dark text-white">
            <div className="card-header">Login</div>
            <div className="card-body">
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
                  <button className="btn btn-primary" type="submit">
                    Login
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