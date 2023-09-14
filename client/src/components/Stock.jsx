import React, { useState, useEffect } from 'react';
import { getAllStock } from '../api/inventario';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/authentication';
import { useAuth } from '../AuthContext';
import { StockCard } from './StockCard';

export function Stock({ size }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, user, userDetails, fetchStock, stock } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetchStock();
    setLoading(false)
  }, []);

  // Función para calcular los días restantes hasta la caducidad
  const calcularDiasRestantes = (item) => {
    const fechaCaducidad = item.fecha_caducidad_descongelacion || item.caducidad_fabricante;
    const fechaActual = new Date();
    const fechaCaducidadDate = new Date(fechaCaducidad);
    const diferenciaDias = Math.ceil((fechaCaducidadDate - fechaActual) / (1000 * 60 * 60 * 24));
    return diferenciaDias - 1;
  };

  // Función para determinar la clase de color del botón
  const determinarClaseColor = (diasRestantes) => {
    if (diasRestantes > 10) {
      return 'btn-success';
    } else if (diasRestantes >= 5 && diasRestantes <= 10) {
      return 'btn-warning';
    } else if (diasRestantes >= 0 && diasRestantes < 5) {
      return 'btn-danger';
    } else {
      return 'btn-dark';
    }
  };

  // Verificar si userDetails es nulo y manejarlo adecuadamente
  if (loading) {
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
      <div className="container card " style={{ maxHeight: '75vh', overflowY: 'auto' }}>
        <h3 className="card-title fs-4 mt-2 text-success text-center">
          Stock vacunatorio {userDetails.vacunatorio_nombre}
        </h3>

        <div className="accordion fs-5" id="stockAccordion">
          {stock.map((item) =>
            item.vacunatorio === userDetails.vacunatorio && item.stock !== 0 ? (
              <div className="accordion-item bg-secondary" key={item.id}>
                <h2 className={`accordion-header ${determinarClaseColor(calcularDiasRestantes(item))}`} id={`heading${item.id}`}>
                  <button
                    className={`btn w-100 ${determinarClaseColor(calcularDiasRestantes(item))}`}
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
                        {item.fecha_caducidad_descongelacion && (
                          <h6>Vigencia: {calcularDiasRestantes(item)} dias</h6>
                        )}
                        {!item.fecha_caducidad_descongelacion && (
                          <h6>Días restantes: {calcularDiasRestantes(item)} dias</h6>
                        )}
                      </div>
                      <div className="col-1 ">
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
                    <StockCard stock={item} size={size} />
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
