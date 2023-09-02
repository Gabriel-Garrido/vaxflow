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
    <div className="container card mt-5">
      <h1 className='card-title text-center'>Stock</h1>
      <ul className="list-group card-body">
        {stock.map(item => (
          <li key={item.id} className="list-group-item stock-item" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">
            <div className="d-flex justify-content-between align-items-center">
            <img
              src={`../../public/images/Pfizer bivalente.jpg`}
              alt={item.nombre}
              className="img-fluid mt-3 ms-3"
              style={{ maxWidth: '150px', maxHeight: '100px' }} // Ajusta el tamaño según tus necesidades
            />
              <h2>{item.nombre_vacuna}</h2>
              <span className="badge rounded-pill bg-primary fs-5">{item.stock} dosis </span>
            </div>
              <div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
                <div class="offcanvas-header">
                  <h3 class="offcanvas-title" id="offcanvasBottomLabel">{item.nombre_vacuna}</h3>
                  <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body big">
                  <StockCard stock={item}/>
                </div>
              </div>
          </li>
          
          ))}
      </ul>
    </div>

  );
}