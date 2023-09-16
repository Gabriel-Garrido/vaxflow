import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Traspaso } from './Traspaso';
import { createEliminacionVacuna } from '../api/inventario';
import { useAuth } from '../AuthContext';
import { Eliminacion } from './Eliminacion';

export function StockCard({ stock, size }) {
  const [cantidadEliminada, setCantidadEliminada] = useState(0);
  const { userDetails } = useAuth();
  const [processing, setProcessing] = useState(false);

  // Define una referencia al modal de eliminación
  const eliminacionModalRef = useRef(null);

  const handleEliminacionVacuna = async (e) => {
    e.preventDefault();

    try {
      setProcessing(true);

      const eliminacionVacunaData = {
        vacuna: stock.id,
        cantidad_eliminada: parseInt(cantidadEliminada),
        responsable_eliminacion: userDetails.id,
        vacunatorio_eliminacion: userDetails.vacunatorio,
      };

      await createEliminacionVacuna(eliminacionVacunaData);

      // Cierra el modal después de reportar la eliminación utilizando la referencia
      eliminacionModalRef.current?.hide();
      setCantidadEliminada(0);
      setProcessing(false);
    } catch (error) {
      console.error('Error en reportar eliminación de vacunas:', error);
      setProcessing(false);
      // Manejar errores aquí, por ejemplo, mostrar un mensaje de error al usuario
    }
  };

  return (
    <div key={stock.id + size} className="card text-white">
      <div className="card-body text-start row">
        <div className="col-6">
          {stock.fecha_descongelacion && stock.hora_descongelacion && (
            <p className="mb-0 custom-stock-card">
              <strong>
                <i className="fa-solid fa-temperature-arrow-up"></i> Descongelación:{' '}
              </strong>{' '}
              <br />{' '}
              {format(new Date(stock.fecha_descongelacion), 'dd MMM yyyy', { locale: es })}{' '}
              - {format(new Date(`1970-01-01T${stock.hora_descongelacion}`), 'hh:mm')}
            </p>
          )}
          <br />
          {stock.fecha_caducidad_descongelacion && (
            <p className="mb-0 custom-stock-card">
              <strong>
                <i className="fa-solid fa-hourglass-half"></i> Caducidad por descong:
              </strong>{' '}
              <br />{' '}
              {format(new Date(stock.fecha_caducidad_descongelacion), 'dd MMM yyyy', { locale: es })}{' '}
              - {format(new Date(`1970-01-01T${stock.hora_descongelacion}`), 'hh:mm')}
            </p>
          )}
          <hr />
          <p className="mb-0 custom-stock-card">
            <strong>Caducidad fabricante:</strong>{' '}
            {format(new Date(stock.caducidad_fabricante), 'eee dd MMM yyyy', { locale: es })}
          </p>
        </div>

        <div className="container col-6">
          <div className="row text-center">
            <div className="col-12 mb-2">
              <div className="row ">
                {/* Botón "Entrgar vacunas" */}
                <button
                  type="button"
                  className="btn btn-primary flex-fill col-12 mb-1"
                  data-bs-toggle="modal"
                  data-bs-target={`#offcanvas${stock.id + size}`}
                >
                  <div>
                    <div>
                      <i className="fa-regular fa-paper-plane fs-4"></i>
                    </div>
                    <div>Entregar vacunas</div>
                  </div>
                </button>
                {/* Botón "Reportar número de administradas" */}
                <button
                  type="button"
                  className="btn btn-success col-12 mb-1"
                  data-bs-toggle="modal"
                  data-bs-target={`#reportarAdministradas${stock.id + size}`}
                >
                  <div>
                    <div>
                      <i className="fa-solid fa-syringe fs-4"></i>
                    </div>
                    <div>Reportar número de administradas</div>
                  </div>
                </button>
                {/* Botón "Reportar vacunas eliminadas" */}
                <button
                  type="button"
                  className="btn btn-danger col-12"
                  data-bs-toggle="modal"
                  data-bs-target={`#reportarEliminadas${stock.id + size}`}
                >
                  <div>
                    <div>
                      <i className="fa-regular fa-trash-alt fs-4"></i>
                    </div>
                    <div>Reportar vacunas eliminadas</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Traspaso*/}
        <div
          className="modal fade"
          tabIndex="-1"
          id={`offcanvas${stock.id + size}`}
          aria-labelledby={`offcanvas${stock.id + size}Label`}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-start">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`offcanvas${stock.id + size}Label`}>
                  Offcanvas
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-center">
                <div className="text-start">
                  <Traspaso stock={stock} size={size} />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary mt-3 fs-3"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal "Reportar número de administradas" */}
        <div
          className="modal fade"
          tabIndex="-1"
          id={`reportarAdministradas${stock.id + size}`}
          aria-labelledby={`reportarAdministradas${stock.id + size}Label`}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-start">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`reportarAdministradas${stock.id + size}Label`}>
                  Reportar número de administradas
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-center">
                <div className="text-start">
                  <Traspaso stock={stock} size={size} />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary mt-3 fs-3"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal "Reportar vacunas eliminadas" */}
        <div
          className="modal fade"
          tabIndex="-1"
          id={`reportarEliminadas${stock.id + size}`}
          aria-labelledby={`reportarEliminadas${stock.id + size}Label`}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-start">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`reportarEliminadas${stock.id + size}Label`}>
                  Reportar vacunas eliminadas
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-center">
                <div className="text-start">
                  <Eliminacion stock={stock}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
