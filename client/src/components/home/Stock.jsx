import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { StockCard } from './StockCard';
import moment from 'moment';

const vacunaImages = {
  'Pfizer bivalente': '../../public/images/Pfizer bivalente.jpg',
  'Pfizer pediatrica': '../../public/images/Pfizer pediatrica.jpg',
  'Sinovac': '../../public/images/Sinovac.jpg',
  'Influenza': '../../public/images/Influenza.jpg',
  'vacuna': '../../public/images/Vacuna.jpg'
};

export function Stock({ size, userDetails }) {
  const [loading, setLoading] = useState(true);
  const { fetchStock, stock } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetchStock();
    setLoading(false)
  }, []);

  // Función para calcular los días restantes hasta la caducidad
  const calcularDiasRestantes = (item) => {
    const fechaCaducidad = moment(item.fecha_caducidad_descongelacion || item.caducidad_fabricante);
    const fechaActual = moment();
    const fechaCaducidadDate = new Date(fechaCaducidad);
    const diferenciaDias = Math.ceil((fechaCaducidadDate - fechaActual) / (1000 * 60 * 60 * 24));
    return diferenciaDias;
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
        <div className={`accordion-header ${determinarClaseColor(calcularDiasRestantes(item))}`} id={`heading${item.id}`}>
          <button
            className={`btn w-100 ${determinarClaseColor(calcularDiasRestantes(item))}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#collapse${item.id}`}
            aria-expanded="false"
            aria-controls={`collapse${item.id}`}
          >
            <div className="row align-items-stretch d-flex" style={{ overflow: 'hidden' }}>
              <img
                src={vacunaImages[item.nombre_vacuna] || vacunaImages['vacuna']}
                alt={item.nombre}
                className="col-3 img-fluid object-fit-contain border-end border-secondary"
                style={{ maxWidth: '100px', maxHeight: '60px' }}
              />
              <div className="col-6 border-end border-secondary">
                
                <div style={{ maxHeight: '100px', overflow: 'hidden' }}>
                  <h6 className="mb-0 fs-6 border-bottom border-secondary">{item.nombre_vacuna}</h6>
                </div>
                <div className="fs-7">Lote: {item.lote}</div>
                {item.fecha_caducidad_descongelacion && (
                  <h6>Vigencia: {calcularDiasRestantes(item)} días</h6>
                )}
                {!item.fecha_caducidad_descongelacion && (
                  <h6>Vigencia: {calcularDiasRestantes(item)} días</h6>
                )}
                
              </div>
              
              <div className="col-2 position-relative float-start">
                
                  <span className=" fs-7 badge rounded-pill bg-primary fs-7 end-0">
                    {item.stock} dosis
                  </span>
                
              </div>
            
            </div>
          </button>
        </div>
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
