import React, { useState, useEffect } from 'react';

export function ReporteVacuna({ vacuna, userDetails, traspasos, eliminaciones, stock }) {
  const [enviadas, setEnviadas] = useState([]);
  const [recibidas, setRecibidas] = useState([]);
  const [eliminadas, setEliminadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockInicial, setStockInicial] = useState(0);

  useEffect(() => {
    setLoading(true);
    getEnviadas();
    getRecibidas();
    getEliminadas();
    totalStockInicial();
    setLoading(false);
  }, [traspasos, eliminaciones, vacuna, userDetails, stock]);

  function totalStockInicial() {

    const totalCantidadEliminada = eliminadas.reduce((acumulador, eliminacion) => {
      return acumulador + eliminacion.cantidad_eliminada;
    }, 0);
    const totalCantidadEnviadas = enviadas.reduce((acumulador, administracion) => {
      return acumulador + administracion.cantidad_traspasada;
    }, 0);
    const totalCantidadRecibidas = recibidas.reduce((acumulador, recepcion) => {
      return acumulador + recepcion.cantidad_traspasada;
    }, 0);
    setStockInicial(vacuna.stock + totalCantidadEliminada + totalCantidadEnviadas - totalCantidadRecibidas)
  }

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
        <ul className="list-group list-group-flush text-start">
          <li key={`inicial${vacuna.id}`} className="list-group-item">
            <strong>Stock Inicial:</strong> {stockInicial}
          </li>
        </ul>
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
        
        <ul className="list-group list-group-flush text-start mb-2">
          <li key={`final${vacuna.id}`} className="list-group-item">
          <strong>Stock Final:</strong> {vacuna.stock}
          </li>
        </ul>
      </div>
    );
  }
}
