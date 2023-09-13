import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getAllTraspasos } from '../api/inventario';

export function ReporteVacuna({ vacuna }) {
  const { userDetails } = useAuth();
  const [enviadas, setEnviadas] = useState([]);
  const [recibidas, setRecibidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    async function fetchTraspasos() {
      try {
        const response = await getAllTraspasos();
        const today = new Date().toISOString().split('T')[0];
        const traspasosEnviados = response.data.filter(
          (traspaso) =>
            traspaso.responsable_entrega === userDetails.id &&
            traspaso.vacuna_traspaso === vacuna.id &&
            traspaso.fecha_traspaso.split('T')[0] === today
        );

        const traspasosRecibidos = response.data.filter(
          (traspaso) =>
            traspaso.responsable_recepcion === userDetails.id &&
            traspaso.vacuna_traspaso === vacuna.id &&
            traspaso.fecha_traspaso.split('T')[0] === today
        );

        setEnviadas(traspasosEnviados);
        setRecibidas(traspasosRecibidos);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching traspasos:', error);
      }
    }

    fetchTraspasos();
  }, [userDetails, vacuna.id]);

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
