import React, { useState } from 'react';
import { createEliminacionVacuna, createAdministracionVacuna } from '../api/inventario';
import { useAuth } from '../AuthContext';



export function ReporteVacuna({ vacunaNombre, vacunaId }) {
  const [eliminadas, setEliminadas] = useState(0);
  const [administradas, setAdministradas] = useState(0);
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(true);


  const handleGuardar = async () => {
    setLoading(true)
    try {
      // Guardar datos de eliminación
      await createEliminacionVacuna({
        vacuna: vacunaId,
        cantidad_eliminada: eliminadas,
        responsable_eliminacion: userDetails.id
      });

      // Guardar datos de administración
      await createAdministracionVacuna({
        vacuna: vacunaId,
        cantidad_administrada: administradas,
      });

      // Limpia los campos después de guardar
      setEliminadas(0);
      setAdministradas(0);

      setLoading(false)
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      // Maneja el error de acuerdo a tus necesidades
      setLoading(false)
    }
  };

  if (!userDetails) {
    return (
    <div>
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>)
  }else{

  return (
    <div className="card text-white">
      <div className="card-body text-start">
        <h5 className="card-title">{vacunaNombre}</h5>
        <div className="mb-3">
          <label className="form-label">Eliminadas</label>
          <input
            type="number"
            className="form-control"
            value={eliminadas}
            onChange={(e) => setEliminadas(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Administradas</label>
          <input
            type="number"
            className="form-control"
            value={administradas}
            onChange={(e) => setAdministradas(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleGuardar}>
          Guardar
        </button>
      </div>
    </div>
  );
}
}