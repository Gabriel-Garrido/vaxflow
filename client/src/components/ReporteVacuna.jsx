import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

export function ReporteVacuna({ vacuna, traspasos, userDetails, eliminaciones }) {
  const { stock } = useAuth();
  const [enviadas, setEnviadas] = useState([]);
  const [recibidas, setRecibidas] = useState([]);
  const [eliminadas, setEliminadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEliminadas();
    getEnviadas();
    getRecibidas();
    setLoading(false)
  }, [traspasos, eliminaciones, vacuna, userDetails]);

  function getEnviadas() {
    if (traspasos) {
      const envios = traspasos.filter((traspaso) => {
        return traspaso.vacunatorio_origen === userDetails.vacunatorio && vacuna.id === traspaso.vacuna_traspaso;
      });
      console.log('---enviadas---')
      console.log(envios);;
      setEnviadas(envios);
    }
  }

  function getRecibidas() {
    console.log('------Get Recibidas --------------------------------------------------------------------------' + vacuna.nombre_vacuna);
    if (traspasos) {
      const recepciones = traspasos.filter((traspaso) => {
        if (traspaso.vacunatorio_destino === userDetails.vacunatorio) {
          console.log('vacuna => ')
          console.log(vacuna)
          console.log('traspaso =>')
          console.log(traspaso);
        return 
        }
      });
      console.log('---recibidas---')
      console.log(recepciones);;
      setRecibidas(recepciones);
    }
  }

  async function getEliminadas() {
    setLoading(true);
        const today = new Date().toDateString();
        const eliminacionesHoy = eliminaciones.filter((eliminacion) => {
          eliminacion
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
        <h5 className="card-title text-success fs-6">{vacuna.nombre_vacuna} {vacuna.lote}</h5>
        {enviadas.length > 0 && (
          <ul className="list-group list-group-flush text-start">
            {enviadas.map((traspaso) => (
              <li key={`enviada${traspaso.id}`} className="list-group-item">
                <i className="fa-regular fa-paper-plane fs-6"></i> Entregadas a {traspaso.vacunatorio_destino_nombre}: {traspaso.cantidad_traspasada}
              </li>
            ))}
          </ul>
        )}
        {recibidas.length > 0 && (
          <ul className="list-group list-group-flush text-start">
            {recibidas.map((traspaso) => (
              <li key={`recibida${traspaso.id}`} className="list-group-item">
                <i className="fa-regular fa-circle-down fs-6"></i> Recibidas de {traspaso.vacunatorio_origen_nombre}: {traspaso.cantidad_traspasada}
              </li>
            ))}
          </ul>
        )}
        {eliminadas.length > 0 && (
          <ul className="list-group list-group-flush text-start">
            {eliminadas.map((eliminacion) => (
              <li key={eliminacion.id} className="list-group-item">
                <i className="fa-regular fa-trash-alt fs-6"></i> Eliminadas: {eliminacion.cantidad_eliminada}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
