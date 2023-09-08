import React, { useState, useEffect } from 'react';
import { getAllStock } from '../api/inventario';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/authentication';
import { useAuth } from '../AuthContext';
import { StockCard } from './StockCard';

export function Stock() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, user, userDetails, fetchStock, stock } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetchStock()
  }, []);

  // Verificar si userDetails es nulo y manejarlo adecuadamente
  if (!userDetails) {
    return (
      <div>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container card" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
        <h3 className="text-center text-primary card-header fs-3 text-success mb-3">
          Stock vacunatorio {userDetails.vacunatorio_nombre}
        </h3>

        <div className="accordion" id="stockAccordion">
          {stock.map((item) =>
            item.vacunatorio === userDetails.vacunatorio && item.stock !== 0 ? (
              <div className="accordion-item bg-secondary" key={item.id}>
                <h2 className="accordion-header bg-success" id={`heading${item.id}`}>
                  <button
                    className=" btn btn-success w-100"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${item.id}`}
                    aria-expanded="false"
                    aria-controls={`collapse${item.id}`}
                  >
                    <div className="row">
                      <div className="col-3">
                        <img
                          src={`../../public/images/Pfizer bivalente.jpg`}
                          alt={item.nombre}
                          className="img-fluid"
                          style={{ maxWidth: '60px', maxHeight: '50px' }}
                        />
                      </div>
                      <div className="col-6">
                        <h1 className="mb-0 fs-5"> {item.nombre_vacuna} </h1>
                        <h5 className="fs-6">Lote: {item.lote}</h5>
                      </div>
                      <div className="col-1">
                        <span className=" fs-6 badge rounded-pill bg-primary fs-6">{item.stock} dosis</span>
                      </div>
                      <div className="col-1"></div>
                    </div>
                  </button>
                </h2>
                <div
                  id={`collapse${item.id}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading${item.id}`}
                  data-bs-parent="#stockAccordion"
                >
                  <div className="accordion-body bg-secondary">
                    <StockCard stock={item} />
                  </div>
                </div>
              </div>
            ) : (
              <div key={item.id}></div>
            )
          )}
        </div>
      </div>
    );
  }
}
