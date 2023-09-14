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
    console.log("---vacuna---");
    console.log(vacuna);

   setLoading(false)
  }, [traspasos]);

function getEnviadas() {
  const envios = traspasos.filter((traspaso) => {
    console.log("---traspaso---");
    console.log(traspaso);
    return traspaso.vacunatorio_destino != userDetails.vacunatorio && vacuna.id == traspaso.vacuna_traspaso
  })
  console.log('---envidas hoy---')
  console.log(envios);
  setEnviadas(envios)
}

function getRecibidas() {
  const recepciones = traspasos.filter((traspaso) => {
    return traspaso.vacunatorio_destino == userDetails.vacunatorio && vacuna.id == traspaso.vacuna_traspaso
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
      <div className="container custom-tabe-style">
        <h5 className="card-title text-success fs-6">{vacuna.nombre_vacuna} {vacuna.lote}</h5>
        <ul className="list-group list-group-flush text-start">
          {enviadas.map((traspaso) => (
            
            <li key={traspaso.id} className="list-group-item">
              <i className="fa-regular fa-paper-plane fs-6"></i> Entregadas a {traspaso.vacunatorio_destino_nombre}: {traspaso.cantidad_traspasada}
            </li>
          ))}
        </ul>
        <ul className="list-group list-group-flush text-start">
          {recibidas.map((traspaso) => (
            <li key={traspaso.id} className="list-group-item">
               <i className="fa-regular fa-circle-down fs-6"></i> Recibidas de {traspaso.vacunatorio_origen_nombre}: {traspaso.cantidad_traspasada}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
