import React, { useState } from 'react';
import { createVacuna } from '../../api/inventario';


export function NuevaVacuna({ size }) {
  const [nombre, setNombre] = useState('');
  const [fechaCaducidad, setFechaCaducidad] = useState('');
  const [lote, setLote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCrearVacuna = async () => {
    setIsLoading(true);
    
    try {
      const nuevaVacunaData = {
        nombre: nombre,
        fecha_caducidad_fabricante: fechaCaducidad,
        lote: lote,
      };

      // Enviar la solicitud para crear la nueva vacuna
      await createVacuna(nuevaVacunaData);

      // Limpia los campos después de agregar la vacuna
      setNombre('');
      setFechaCaducidad('');
      setLote('');

      // Cierra el modal
      const modalId = `#modalNuevaVacuna${size}`;
      const modal = new bootstrap.Modal(document.querySelector(modalId));
      modal.hide();
    } catch (error) {
      console.error('Error al crear la vacuna:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-success fs-4"
        data-bs-toggle="modal"
        data-bs-target={`#modalNuevaVacuna${size}`}
      >
        <div>
          <div className="text-center">
            <strong>
              <i className="fa-regular fa-circle-down fs-6"></i> Nueva vacuna
            </strong>
          </div>
        </div>
      </button>

      <div
        className="modal"
        tabIndex="-1"
        id={`modalNuevaVacuna${size}`}
        aria-labelledby={`modalNuevaVacuna${size}Label`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-start">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={`modalNuevaVacuna${size}Label`}
              >
                <div className="container text-center">
                  <strong>Recibir vacunas camara</strong>
                </div>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center">
              <form>
                <div className="mb-3">
                  <label htmlFor="nombreVacuna" className="form-label">
                    Nombre de la vacuna
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombreVacuna"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fechaCaducidad" className="form-label">
                    Fecha de caducidad
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaCaducidad"
                    value={fechaCaducidad}
                    onChange={(e) => setFechaCaducidad(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lote" className="form-label">
                    Lote
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lote"
                    value={lote}
                    onChange={(e) => setLote(e.target.value)}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="">
              <button
                type="button"
                className="btn btn-secondary mb-3 fs-3"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success mb-3 ms-2 fs-3"
                onClick={handleCrearVacuna}
                disabled={isLoading}
              >
                {isLoading ? 'Creando...' : 'Crear Vacuna'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
