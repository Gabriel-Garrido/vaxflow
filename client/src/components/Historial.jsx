import React, { useState, useEffect } from 'react';
import { getAllTraspasos } from '../api/inventario';
import { useAuth } from '../AuthContext';

export function Historial() {
  const [traspasos, setTraspasos] = useState([]);
  const [tipoTraspaso, setTipoTraspaso] = useState('todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const { userDetails } = useAuth();

  useEffect(() => {
    async function fetchTraspasos() {
      try {
        const response = await getAllTraspasos();
        setTraspasos(response.data);
      } catch (error) {
        console.error('Error fetching traspasos:', error);
      }
    }

    fetchTraspasos();
  }, []);

  const filteredTraspasos = traspasos.filter((traspaso) => {
    if (tipoTraspaso === 'todos' || tipoTraspaso === 'enviados') {
      if (traspaso.responsable_entrega === userDetails.id) {
        return true;
      }
    }
    if (tipoTraspaso === 'todos' || tipoTraspaso === 'recibidos') {
      if (traspaso.responsable_recepcion === userDetails.id) {
        return true;
      }
    }
    return false;
  });

  const filteredTraspasosByFecha = filteredTraspasos.filter((traspaso) => {
    if (fechaInicio && fechaFin) {
      const fechaTraspaso = new Date(traspaso.fecha_traspaso);
      const fechaInicioFilter = new Date(fechaInicio);
      const fechaFinFilter = new Date(fechaFin);
      return fechaTraspaso >= fechaInicioFilter && fechaTraspaso <= fechaFinFilter;
    }
    return true;
  });

  return (
    <div className='card text-bg-dark mt-4'>
      <h2 className='card-title'>Historial de Traspasos</h2>
      <div className="mb-3 card-body">
        <label htmlFor="tipoTraspaso" className="form-label">
          Tipo de Traspaso:
        </label>
        <select
          id="tipoTraspaso"
          className="form-select"
          value={tipoTraspaso}
          onChange={(e) => setTipoTraspaso(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="enviados">Enviados</option>
          <option value="recibidos">Recibidos</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="fechaInicio" className="form-label">
          Fecha de Inicio:
        </label>
        <input
          type="date"
          id="fechaInicio"
          className="form-control"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="fechaFin" className="form-label">
          Fecha de Fin:
        </label>
        <input
          type="date"
          id="fechaFin"
          className="form-control"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Fecha de Traspaso</th>
            <th>Tipo de Traspaso</th>
            <th>Vacuna</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
  {filteredTraspasosByFecha.map((traspaso) => (
    <tr key={traspaso.id}>
      <td>{new Date(traspaso.fecha_traspaso).toLocaleDateString()}</td>
      <td>
        {traspaso.responsable_entrega === userDetails.id
          ? 'Enviado'
          : 'Recibido'}
      </td>
      <td>
        {traspaso.vacuna_traspaso && traspaso.vacuna_traspaso.tipo_vacuna
          ? traspaso.vacuna_traspaso.tipo_vacuna.nombre
          : 'N/A'}
      </td>
      <td>{traspaso.cantidad_traspasada}</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
