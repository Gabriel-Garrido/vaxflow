import React, { useEffect, useState } from 'react';
import { getAllStock } from '../api/inventario';
import { useAuth } from '../AuthContext';
import { ReporteVacuna } from './ReporteVacuna';

export function Reportes() {
  const { userDetails, fetchUserDetails, fetchStock, stock } = useAuth();
  const [vacunasConStock, setVacunasConStock] = useState([]);

  useEffect(() => {
    fetchStock();
  }, [userDetails]);

  useEffect(() => {
    // Filtrar las vacunas con stock mayor o igual a 1
    const vacunasFiltradas = stock.filter((vacuna) => vacuna.stock >= 1);
    setVacunasConStock(vacunasFiltradas);
  }, [stock]);

  if (!userDetails) {
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
      <div className="card text-dark">
        <h2 className="card-title fs-4 mt-2 text-success text-center">Reporte Diario</h2>
        <div className="card-body text-center">
          {vacunasConStock.map((vacuna) => (
            <ReporteVacuna key={vacuna.id} vacuna={vacuna} />
          ))}
        </div>
      </div>
    );
  }
}
