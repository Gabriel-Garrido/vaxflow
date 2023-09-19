import React, { useState, useEffect } from 'react';

export function NuevaVacuna({ size }) {

  return (
    <div>
      {/* Botón "Recibir vacunas" */}
      <button
        type="button"
        className="btn btn-outline-success fs-4"
        data-bs-toggle="modal"
        data-bs-target={`#modalNuevaVacuna${size}`}
      >
        <div>
          <div className='text-center'><strong><i className="fa-regular fa-circle-down fs-6"></i> Nueva vacuna</strong></div>
        </div>
      </button>

      <div className="modal" tabIndex="-1" id={`modalNuevaVacuna${size}`} aria-labelledby={`modalNuevaVacuna${size}Label`} aria-hidden="true">
        <div className="modal-dialog modal-dialog-start">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`modalNuevaVacuna${size}Label`}>
                <div className='container text-center'><strong>Recibir vacunas camara</strong></div>
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center">
              
            </div>
            <div className=''>
            <button
              type="button"
              className="btn btn-secondary mb-3 fs-3"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              Cancelar
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
