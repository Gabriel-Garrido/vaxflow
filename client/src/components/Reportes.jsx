import React, { useEffect, useState } from 'react';
import { getAllStock, getAllTraspasos } from '../api/inventario';
import { useAuth } from '../AuthContext';
import { ReporteVacuna } from './ReporteVacuna';

export function Reportes() {
  const { userDetails, fetchUserDetails, fetchStock, stock } = useAuth();
  const [todaysTraspasos, setTodaysTraspasos] = useState([]);
  const [vacunasConStock, setVacunasConStock] = useState([])

  useEffect(() => {
    fetchStock();
    fetchTodaysTraspasos();
  }, [userDetails]);

  useEffect(() => {
    const vacunasFiltradas = stock.filter((vacuna) => vacuna.vacunatorio==userDetails.vacunatorio);
    setVacunasConStock(vacunasFiltradas);
  }, [stock]);

  const fetchTodaysTraspasos = async () => {
    try {
      const response = await getAllTraspasos();
      const today = new Date().toISOString().split('T')[0];
      const todaysTraspasos = response.data.filter((traspaso) => traspaso.fecha_traspaso.split('T')[0] === today);
      setTodaysTraspasos(todaysTraspasos);
    } catch (error) {
      console.error('Error fetching traspasos:', error);
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
      </div>
    );
  } else {
    return (
      <div className="card text-dark">
        <h2 className="card-title fs-4 mt-2 text-success text-center">Reporte Diario</h2>
        <div className="card-body text-center">
          {vacunasConStock.map((vacuna) => (
            <ReporteVacuna key={vacuna.id} vacuna={vacuna} todaysTraspasos={todaysTraspasos} stock={stock} />
          ))}
        </div>
      </div>
    );
  }
}
