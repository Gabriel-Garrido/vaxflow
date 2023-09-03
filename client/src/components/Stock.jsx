import React, { useState, useEffect } from 'react';
import { getAllStock } from '../api/inventario';
import { useNavigate } from 'react-router-dom'
import { logout } from '../api/authentication'
import { useAuth } from '../AuthContext';
import { StockCard } from './StockCard';

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
  console.log(stock);
  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary">Stock</h1>
      <ul className="list-group">
        {stock.map(item => (
          <li
            key={item.id}
            className="list-group-item btn btn-link btn-block stock-item"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#stockItem${item.id}`}
            aria-expanded="false"
          >
              <div className="d-flex justify-content-between align-items-center">
                <img
                  src={`../../public/images/Pfizer bivalente.jpg`}
                  alt={item.nombre}
                  className="img-fluid"
                  style={{ maxWidth: '150px', maxHeight: '100px' }}
                />
                <h2 className="mb-0">{item.nombre_vacuna}</h2>
                <span className="badge bg-primary fs-5">{item.stock} dosis</span>
              </div>
            <div
              id={`stockItem${item.id}`}
              className="collapse"
            >
              <div className="card card-body">
                <StockCard stock={item} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}