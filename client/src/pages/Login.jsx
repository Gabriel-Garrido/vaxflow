import React, { useState } from 'react';
import { login } from '../api/authentication';
import { useNavigate } from 'react-router-dom';

export function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login({ username, password });
      if (response) {
        console.log('Login successful:', response.data);
        setIsAuthenticated(true); // Actualiza el estado de autenticación en App
        navigate('/home'); // Redirige a la página de inicio
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    navigate('/home'); // Redirige a la página de inicio
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
