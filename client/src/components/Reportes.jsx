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
    console.log('----vacunasFiltradas----');
    console.log(vacunasFiltradas);
  }, [stock]);

  const fetchTodaysTraspasos = async () => {
    try {
      const response = await getAllTraspasos();
      const today = new Date().toDateString(); // Obtiene la fecha de hoy en formato de cadena
      console.log('------traspasos------');
      console.log(response.data);
      const todaysTraspasos = response.data.filter((traspaso) => {
        const traspasoDate = new Date(traspaso.fecha_traspaso).toDateString();
        return traspasoDate === today;
      });
      console.log('------hoy------');
      console.log(todaysTraspasos);
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
        <h2 className="card-title fs-3 mt-2 text-success text-center">Reporte Diario</h2> <hr />
        <div className="card-body text-center" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {vacunasConStock.map((vacuna) => (
            <ReporteVacuna key={vacuna.id} vacuna={vacuna} traspasos={todaysTraspasos} />
          ))}
        </div>
      </div>
    );
  }
}
