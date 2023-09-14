import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getAllTraspasos } from '../api/inventario';

export function ReporteVacuna({ vacuna, traspasos }) {
  const { userDetails, stock } = useAuth();
  const [enviadas, setEnviadas] = useState([]);
  const [recibidas, setRecibidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEnviadas()
    getRecibidas()
   setLoading(false)
  }, [traspasos]);

function getEnviadas() {
  const envios = traspasos.filter((traspaso) => {
    return traspaso.vacunatorio_destino != userDetails.vacunatorio
  })
  console.log('---envidas hoy---')
  console.log(envios);
  setEnviadas(envios)
}

function getRecibidas() {
  const recepciones = traspasos.filter((traspaso) => {
    return traspaso.vacunatorio_destino == userDetails.vacunatorio
  })
  console.log('---recibidas hoy---')
  console.log(recepciones);
  setRecibidas(recepciones)
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
      <div className="container">
        <h5 className="card-title text-success mt-4">{vacuna.nombre_vacuna} {vacuna.lote} {vacuna.fecha_descongelacion}</h5>
        <ul className="list-group list-group-flush">
          {enviadas.map((traspaso) => (
            <li key={traspaso.id} className="list-group-item">
               Entregadas a {traspaso.vacunatorio_destino_nombre}: {traspaso.cantidad_traspasada}
            </li>
          ))}
        </ul>
        <ul className="list-group list-group-flush">
          {recibidas.map((traspaso) => (
            <li key={traspaso.id} className="list-group-item">
               Recibidas de {traspaso.vacunatorio_origen_nombre}: {traspaso.cantidad_traspasada}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
