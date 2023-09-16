import React, { useState, useEffect } from 'react';
import { getAllTraspasos } from '../api/inventario';
import { useAuth } from '../AuthContext';

export function Historial({userDetails}) {
  const [traspasos, setTraspasos] = useState([]);
  const [tipoTraspaso, setTipoTraspaso] = useState('todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    async function fetchTraspasos() {
      try {
        const response = await getAllTraspasos();
        setTraspasos(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching traspasos:', error);
      }
    }

    fetchTraspasos();
  }, []);

  const filteredTraspasos = traspasos.filter((traspaso) => {
    if (tipoTraspaso === 'todos' || tipoTraspaso === 'enviados') {
      if (traspaso.responsable_entrega.vacunatorio === userDetails.vacunatorio) {
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
    <div className='card text-bg-dark' style={{ maxHeight: '75vh', overflowY: 'auto' }}>
      <h2 className='card-title fs-4 mt-2 text-success text-center'>Historial de Traspasos</h2>
      <div className="card-body text-center fs-3">
        <label htmlFor="tipoTraspaso" className="form-label-sm">
          Tipo de Traspaso:
        </label>
        <select
          id="tipoTraspaso"
          className="form-select-sm"
          value={tipoTraspaso}
          onChange={(e) => setTipoTraspaso(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="enviados">Enviados</option>
          <option value="recibidos">Recibidos</option>
        </select>
      </div>
      <div className="mb-1 text-center">
        <label htmlFor="fechaInicio" className="form-label-sm ">
          Fecha de Inicio:
        </label>
        <input
          type="date"
          id="fechaInicio"
          className="form-control-sm"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
      </div>
      <div className="mb-2 text-center">
        <label htmlFor="fechaFin" className="form-label-sm">
          Fecha de Fin:
        </label>
        <input
          type="date"
          id="fechaFin"
          className="form-control-sm"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
      </div>
      <table className="table table-dark text-center">
        <thead>
          <tr>
            <th><i className="fa-solid fa-calendar-check text-success"></i></th>
            <th><i className="fa-solid fa-syringe text-success"></i></th>
            <th><i className="fa-solid fa-right-left text-success"></i></th>
          </tr>
        </thead>
        <tbody>
          {filteredTraspasosByFecha.reverse().map((traspaso) => (
            <tr key={traspaso.id} className='custom-tabe-style text-center'>
              <td >
                {new Date(traspaso.fecha_traspaso).toLocaleDateString()}
              </td>
              {traspaso.responsable_entrega === userDetails.id ? (<>
                <td>
                  <strong>
                    {traspaso.cantidad_traspasada} dosis de <br /> {traspaso.vacuna_traspaso_nombre}
                  </strong>{' '}
                </td>
                <td>
                <i className="fa-regular fa-paper-plane fs-6"></i> <br /><strong>{traspaso.vacunatorio_destino_nombre}</strong>
                </td>
                </>
              ) : (
                <>
                <td>
                  <strong>
                    {traspaso.cantidad_traspasada} dosis de <br /> {traspaso.vacuna_traspaso_nombre}
                  </strong>{' '}
                </td>
                <td>
                <i className="fa-regular fa-circle-down fs-6"></i><br /> <strong>{traspaso.vacunatorio_origen_nombre}</strong>
                </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
}