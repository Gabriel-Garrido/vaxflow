import React, { useState, useEffect } from 'react';
import { StockCard } from './StockCard';
import moment from 'moment';

export function Stock({ size, userDetails, stock }) {
  const [loading, setLoading] = useState(true);
  const [vacunasAgrupadas, setVacunasAgrupadas] = useState([]);

  useEffect(() => {
    if(userDetails){
      setLoading(true)
      agruparVacunas(stock)
      setLoading(false)
    }
  }, [userDetails, stock]);

console.log("stock en stock",stock);

// Obtener nombres únicos de las vacunas
  const agruparVacunas = (stock) => {
    const vacunaNombres = [...new Set(stock.map((item) => item.vacuna_nombre))]; 
    setVacunasAgrupadas(vacunaNombres);
  };

console.log("vacunasAgrupadas", vacunasAgrupadas)


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

  const formatFecha = (fecha) => {
    return moment(fecha).format('DD-MM-YYYY'); // Formato "dd-mm-aaaa"
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
                
        <h3 className="card-title fs-5 mt-1 text-success text-center">
          Stock vacunatorio {userDetails.vacunatorio_nombre}
        </h3>

        <div className="accordion fs-6" id="stockAccordion">
          {stock.map((item) =>
            item.vacunatorio === userDetails.vacunatorio? (
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
                    <div className="row" style={{ overflow: 'hidden' }}>
                      <div className='col-2 d-flex flex-column justify-content-center align-items-center ms-2'>
                      <span className="badge rounded-pill bg-primary fs-7 end-0">
                            {item.cantidad} dosis
                          </span>
                      
                      </div>
                      <div className="col-8 text-start ">
                        
                        <div style={{ maxHeight: '100px', overflow: 'hidden' }}>
                          <h6 className="fs-6 mb-0 border-bottom border-white"><i className="fa-solid fa-syringe fs-7  "></i> {item.vacuna_nombre}</h6>
                        </div>
                        <div className="fs-7 ms-4 ">Lote: {item.lote}</div>
                        {item.fecha_caducidad_descongelacion && (
                          <h6 className='ms-4'>
                            Vencimiento: <strong>{formatFecha(item.fecha_caducidad_descongelacion)} ({calcularDiasRestantes(item)} días)</strong>
                          </h6>
                        )}
                        {!item.fecha_caducidad_descongelacion && (
                          <h6 className='ms-4'>
                            Vencimiento: <strong>{formatFecha(item.caducidad_fabricante)} ({calcularDiasRestantes(item)} días)</strong>
                          </h6>
                        )}
                        
                      </div>
                      <div className="col-1 d-flex flex-column justify-content-center align-items-start ">
                        
                        <i className="fa-solid fa-angle-down fs-5"></i>
                        
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
