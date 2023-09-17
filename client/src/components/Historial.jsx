import React, { useState, useEffect } from 'react';
import { getAllTraspasos } from '../api/inventario';
import { useAuth } from '../AuthContext';

export function Historial({ userDetails }) {
  const [traspasos, setTraspasos] = useState([]);
  const [tipoTraspaso, setTipoTraspaso] = useState('todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [vacunaNombre, setVacunaNombre] = useState('');
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

  const filterTraspasos = (traspaso) => {
    if (tipoTraspaso === 'todos' ||
        (tipoTraspaso === 'enviados' && traspaso.vacunatorio_origen === userDetails.vacunatorio) ||
        (tipoTraspaso === 'recibidos' && traspaso.vacunatorio_destino === userDetails.vacunatorio)) {
      return true;
    }
    return false;
  };

  const filterTraspasosByFecha = (traspaso) => {
    if (fechaInicio && fechaFin) {
      const fechaTraspaso = new Date(traspaso.fecha_traspaso);
      const fechaInicioFilter = new Date(fechaInicio);
      const fechaFinFilter = new Date(fechaFin);
      fechaTraspaso.setHours(0, 0, 0, 0);
      fechaInicioFilter.setHours(0, 1, 1, 0);
      fechaFinFilter.setHours(23, 60, 59, 0);
      return fechaTraspaso >= fechaInicioFilter && fechaTraspaso <= fechaFinFilter;
    }
    return true;
  };

  const filterTraspasosByVacunaNombre = (traspaso) => {
    if (vacunaNombre && traspaso.vacuna_traspaso_nombre) {
      return traspaso.vacuna_traspaso_nombre.toLowerCase().includes(vacunaNombre.toLowerCase());
    }
    return true;
  };

  const filteredTraspasos = traspasos.filter(filterTraspasos);
  const filteredTraspasosByFecha = filteredTraspasos.filter(filterTraspasosByFecha);
  const filteredTraspasosByVacunaNombre = filteredTraspasosByFecha.filter(filterTraspasosByVacunaNombre);

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
        <div className="card-body">
          <div className="row justify-content-center mb-1">

            <div className="col-6 text-center">
              <label htmlFor="tipoTraspaso" className="form-label-sm">Traspaso:</label>
              <select
                id="tipoTraspaso"
                className="form-select form-select-sm custom-tabe-style"
                value={tipoTraspaso}
                onChange={(e) => setTipoTraspaso(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="enviados">Enviados</option>
                <option value="recibidos">Recibidos</option>
              </select>
            </div>

            <div className="col-6 text-center">
              <label htmlFor="vacunaNombre" className="form-label-sm">Vacuna:</label>
              <input
                type="text"
                id="vacunaNombre"
                className="form-control form-control-sm custom-tabe-style"
                value={vacunaNombre}
                onChange={(e) => setVacunaNombre(e.target.value)}
              />
            </div>

            <div className="col-6 text-center">
              <label htmlFor="fechaInicio" className="form-label-sm">Desde:</label>
              <input
                type="date"
                id="fechaInicio"
                className="form-control form-control-sm custom-tabe-style "
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div className="col-6 text-center">
              <label htmlFor="fechaFin" className="form-label-sm">Hasta:</label>
              <input
                type="date"
                id="fechaFin"
                className="form-control form-control-sm custom-tabe-style"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>

          </div>
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
            {filteredTraspasosByVacunaNombre.reverse().map((traspaso) => (
              <tr key={traspaso.id} className='custom-tabe-style text-center'>
                <td>
                  {new Date(traspaso.fecha_traspaso).toLocaleDateString()}
                </td>
                {traspaso.responsable_entrega === userDetails.id ? (
                  <>
                    <td>
                      <strong>
                        {traspaso.cantidad_traspasada} dosis de <br /> {traspaso.vacuna_traspaso_nombre}
                      </strong>{' '}{traspaso.vacuna_traspaso_lote}
                    </td>
                    <td>
                      <i className="fa-regular fa-paper-plane fs-6"></i> <br /><strong>{traspaso.vacunatorio_destino_nombre} </strong>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      <strong>
                        {traspaso.cantidad_traspasada} dosis de <br /> {traspaso.vacuna_traspaso_nombre}
                      </strong>{' '}{traspaso.vacuna_traspaso_lote}
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
