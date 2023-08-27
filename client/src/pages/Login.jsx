import React, { useState, useEffect } from 'react';
import { login } from '../api/authentication';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const { user, setUser } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await login({ username, password });
      if (response) {
        localStorage.setItem('user', JSON.stringify(username));
        setIsAuthenticated(true);
        setUser(username);
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
