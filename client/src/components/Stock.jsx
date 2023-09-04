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
  const { isAuthenticated, setIsAuthenticated, user, setUser, userDetails} = useAuth();

  useEffect(() => {
    console.log(user);
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
    <div className="container mt-5 card">
      <h3 className="text-center text-primary card-header">Stock vacunatorio {userDetails.vacunatorio_nombre}</h3>

      {/* Acordeón de Bootstrap */}
      <div className="accordion" id="stockAccordion">
        {stock.map(item => (
          item.vacunatorio === userDetails.vacunatorio?

          <div className="accordion-item" key={item.id}>
            <h2 className="accordion-header" id={`heading${item.id}`}>
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${item.id}`}
                aria-expanded="false"
                aria-controls={`collapse${item.id}`}
              >
                <div className="container row">
                  
                  <div className='col-3'>
                    <img
                  src={`../../public/images/Pfizer bivalente.jpg`}
                  alt={item.nombre}
                  className="img-fluid"
                  style={{ maxWidth: '100px', maxHeight: '80px' }}
                />
                  </div>
                
                <div className='col-7'>
                  <h1 className="mb-0"> {item.nombre_vacuna} </h1>
                  <h5>Lote: {item.lote}</h5>
                </div>
                <div className='col-2'>
                  <span className="badge rounded-pill bg-primary fs-6">{item.stock} dosis</span>
                </div>
                
              </div>
              </button>
            </h2>
            <div
              id={`collapse${item.id}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading${item.id}`}
              data-bs-parent="#stockAccordion"
            >
              <div className="accordion-body">
                <StockCard stock={item} />
              </div>
            </div>
          </div>:<></>
        ))}
      </div>
    </div>
  );
}