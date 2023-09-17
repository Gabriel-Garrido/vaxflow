import React, { useState, useEffect } from 'react';

export function ReporteVacuna({ vacuna, userDetails, traspasos, eliminaciones, administraciones, stock }) {
  const [enviadas, setEnviadas] = useState([]);
  const [recibidas, setRecibidas] = useState([]);
  const [eliminadas, setEliminadas] = useState([]);
  const [administradas, setAdministradas] = useState([])
  const [loading, setLoading] = useState(true);
  const [stockInicial, setStockInicial] = useState(0);

  useEffect(() => {
    setLoading(true);
    getEnviadas();
    getRecibidas();
    getEliminadas();
    getAdministradas()
    totalStockInicial();
    setLoading(false);
  }, [traspasos, eliminaciones, vacuna, userDetails, stock]);

  function totalStockInicial() {

    const totalCantidadEliminada = eliminadas.reduce((acumulador, eliminacion) => {
      return acumulador + eliminacion.cantidad_eliminada;
    }, 0);
    const totalCantidadAdministrada = administradas.reduce((acumulador, administracion) => {
      return acumulador + administracion.cantidad_administrada;
    }, 0);
    const totalCantidadEnviadas = enviadas.reduce((acumulador, administracion) => {
      return acumulador + administracion.cantidad_traspasada;
    }, 0);
    const totalCantidadRecibidas = recibidas.reduce((acumulador, recepcion) => {
      return acumulador + recepcion.cantidad_traspasada;
    }, 0);
    setStockInicial(vacuna.stock + totalCantidadEliminada + totalCantidadEnviadas + totalCantidadAdministrada - totalCantidadRecibidas)
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

  async function getAdministradas() {
    setLoading(true);
    const today = new Date().toDateString();
    const administracionesHoy = administraciones.filter((administracion) => {
      return new Date(administracion.fecha).toDateString() === today && vacuna.id === administracion.vacuna;
    });
    setAdministradas(administracionesHoy);
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
      <div className="container card custom-tabe-style mt-2">
        <ul className="list-group  list-group-flush text-start">

        <h5 className="card-title text-success fs-6 mt-2">
          {vacuna.nombre_vacuna} {vacuna.lote}
        </h5>
        <>
          <li key={`inicial${vacuna.id}`} className="list-group-item">
            <strong>Stock Inicial:</strong> {stockInicial}
          </li>
        </>
        {recibidas.length > 0 && (
          <>
            {recibidas.map((traspaso) => (
              <li key={`recibida${traspaso.id}`} className="list-group-item">
                <i className="fa-regular fa-circle-down fs-6"></i> Recibidas de{' '}
                {traspaso.vacunatorio_origen_nombre}: {traspaso.cantidad_traspasada}
              </li>
            ))}
          </>
        )}
        {enviadas.length > 0 && (
          <>
            {enviadas.map((traspaso) => (
              <li key={`enviada${traspaso.id}`} className="list-group-item">
                <i className="fa-regular fa-paper-plane fs-6"></i> Entregadas a{' '}
                {traspaso.vacunatorio_destino_nombre}: {traspaso.cantidad_traspasada}
              </li>
            ))}
          </>
        )}
        {administradas.length > 0 && (
          <>
            {administradas.map((administracion) => (
              <li key={administracion.id} className="list-group-item">
                <i className="fa-solid fa-syringe fs-6"></i> Administradas:{' '}
                {administracion.cantidad_administrada}
              </li>
            ))}
          </>
        )}
        {eliminadas.length > 0 && (
          <>
            {eliminadas.map((eliminacion) => (
              <li key={eliminacion.id} className="list-group-item">
                <i className="fa-regular fa-trash-alt fs-6"></i> Eliminadas:{' '}
                {eliminacion.cantidad_eliminada}
              </li>
            ))}
          </>
        )}
        <>
          <li key={`final${vacuna.id}`} className="list-group-item">
          <strong>Stock Final:</strong> {vacuna.stock}
          </li>
        </>
        </ul>
      </div>
    );
  }
}
