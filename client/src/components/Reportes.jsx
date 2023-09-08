import React, { useState } from 'react';
import { createAdministracionVacuna, createEliminacionVacuna } from '../api/inventario';

export function Reportes() {
  const [reporte, setReporte] = useState({
    vacuna1: { eliminadas: 0, administradas: 0 },
    vacuna2: { eliminadas: 0, administradas: 0 },
    // Agrega más tipos de vacunas según tus necesidades
  });

  const handleChange = (vacuna, campo, valor) => {
    setReporte({
      ...reporte,
      [vacuna]: {
        ...reporte[vacuna],
        [campo]: valor,
      },
    });
  };

  const handleSubmit = async () => {
    try {
      // Realiza una llamada a la API para guardar las eliminaciones y administraciones
      for (const vacuna in reporte) {
        if (reporte.hasOwnProperty(vacuna)) {
          const { eliminadas, administradas } = reporte[vacuna];

          // Guarda las eliminaciones
          await createEliminacionVacuna({
            vacuna,
            cantidad_eliminada: eliminadas,
            responsable_eliminacion: 'Nombre del responsable', // Reemplaza con el nombre correcto
          });

          // Guarda las administraciones
          await createAdministracionVacuna({
            vacuna,
            cantidad_administrada: administradas,
          });
        }
      }

      // Limpia el formulario después de guardar los datos
      setReporte({
        vacuna1: { eliminadas: 0, administradas: 0 },
        vacuna2: { eliminadas: 0, administradas: 0 },
        // Asegúrate de agregar más tipos de vacunas aquí si es necesario
      });

      // Cierra el modal o muestra un mensaje de éxito
      // Puedes agregar tu lógica para manejar el cierre del modal aquí
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      // Maneja el error de acuerdo a tus necesidades
    }
  };

  return (
<div className='card text-bg-dark' style={{ height: '75vh', overflowY: 'auto' }}>  
<h2 className='card-title fs-4 mt-2 text-success text-center'>Reporte Diario</h2>
<div className="card-body text-center">
  <form className="mt-3">
    <div className="mb-3">
      <label className="form-label">Vacuna 1</label>
      <input
        type="number"
        className="form-control"
        value={reporte.vacuna1.eliminadas}
        onChange={(e) => handleChange('vacuna1', 'eliminadas', e.target.value)}
        placeholder="Eliminadas"
      />
      <input
        type="number"
        className="form-control mt-2"
        value={reporte.vacuna1.administradas}
        onChange={(e) => handleChange('vacuna1', 'administradas', e.target.value)}
        placeholder="Administradas"
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Vacuna 2</label>
      <input
        type="number"
        className="form-control"
        value={reporte.vacuna2.eliminadas}
        onChange={(e) => handleChange('vacuna2', 'eliminadas', e.target.value)}
        placeholder="Eliminadas"
      />
      <input
        type="number"
        className="form-control mt-2"
        value={reporte.vacuna2.administradas}
        onChange={(e) => handleChange('vacuna2', 'administradas', e.target.value)}
        placeholder="Administradas"
      />
    </div>
    {/* Agrega más tipos de vacunas aquí según tus necesidades */}
    <button type="button" className="btn btn-primary" onClick={handleSubmit}>
      Hacer Reporte
    </button>
  </form>
  </div>
</div>

  );
}

