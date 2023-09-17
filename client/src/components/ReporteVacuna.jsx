// reportevacunas.jsx
import React, { useState, useEffect } from 'react';

export function ReporteVacuna({ vacuna, userDetails, traspasos, eliminaciones }) {
  const [enviadas, setEnviadas] = useState([]);
  const [recibidas, setRecibidas] = useState([]);
  const [eliminadas, setEliminadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEnviadas();
    getRecibidas();
    getEliminadas();
    setLoading(false);
  }, [traspasos, eliminaciones, vacuna, userDetails]);

  function getEnviadas() {
    const today = new Date().toDateString();
    const enviosHoy = traspasos.filter((traspaso) => {
      return (
        new Date(traspaso.fecha_traspaso).toDateString() === today &&
        traspaso.vacunatorio_origen === userDetails.vacunatorio &&
        traspaso.vacuna_traspaso_nombre === vacuna.nombre_vacuna
      );
    });
    setEnviadas(enviosHoy);
  }

  function getRecibidas() {
    const today = new Date().toDateString();
    const recibosHoy = traspasos.filter((traspaso) => {
      return (
        new Date(traspaso.fecha_traspaso).toDateString() === today &&
        traspaso.vacunatorio_destino === userDetails.vacunatorio &&
        traspaso.vacuna_traspaso_nombre === vacuna.nombre_vacuna
      );
    });
    setRecibidas(recibosHoy);
  }

  async function getEliminadas() {
    setLoading(true);
    const today = new Date().toDateString();
    const eliminacionesHoy = eliminaciones.filter((eliminacion) => {
      return new Date(eliminacion.fecha).toDateString() === today && vacuna.id === eliminacion.vacuna;
    });
    setEliminadas(eliminacionesHoy);
    setLoading(false);
  }

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
      <div className="container custom-tabe-style">
        <h5 className="card-title text-success fs-6">
          {vacuna.nombre_vacuna} {vacuna.lote}
        </h5>
        {enviadas.length > 0 && (
          <ul className="list-group list-group-flush text-start">
            {enviadas.map((traspaso) => (
              <li key={`enviada${traspaso.id}`} className="list-group-item">
                <i className="fa-regular fa-paper-plane fs-6"></i> Entregadas a{' '}
                {traspaso.vacunatorio_destino_nombre}: {traspaso.cantidad_traspasada}
              </li>
            ))}
          </ul>
        )}
        {recibidas.length > 0 && (
          <ul className="list-group list-group-flush text-start">
            {recibidas.map((traspaso) => (
              <li key={`recibida${traspaso.id}`} className="list-group-item">
                <i className="fa-regular fa-circle-down fs-6"></i> Recibidas de{' '}
                {traspaso.vacunatorio_origen_nombre}: {traspaso.cantidad_traspasada}
              </li>
            ))}
          </ul>
        )}
        {eliminadas.length > 0 && (
          <ul className="list-group list-group-flush text-start">
            {eliminadas.map((eliminacion) => (
              <li key={eliminacion.id} className="list-group-item">
                <i className="fa-regular fa-trash-alt fs-6"></i> Eliminadas:{' '}
                {eliminacion.cantidad_eliminada}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
