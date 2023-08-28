import React, { useState, useEffect } from 'react';
import { getAllStock } from '../api/inventario';
import { useNavigate } from 'react-router-dom'
import { logout } from '../api/authentication'
import { useAuth } from '../AuthContext';

export function Stock() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 
  const { isAuthenticated, setIsAuthenticated, user, setUser} = useAuth();

  useEffect(() => {
    async function fetchStock() {
      try {
        const response = await getAllStock();
        console.log(response.data);
        setStock(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock:', error);
        if (
          error.response &&
          error.response.status === 401
        ) {
          logout();
          setIsAuthenticated(false)
          navigate('/login');
        } else {
          setLoading(false);
        }
      }
    }
    if (isAuthenticated) {
      fetchStock();
    } else {
      navigate('/login');
    }
    
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Stock</h2>
      <ul>
        {stock.map(item => (
          <li key={item.id}>
            {item.nombre_vacuna} - Cantidad: {item.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}
