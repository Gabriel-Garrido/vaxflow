import React, { useEffect, useState } from 'react';
import { getAllEliminaciones, getAllStock, getAllTraspasos } from '../api/inventario';
import { useAuth } from '../AuthContext';
import { ReporteVacuna } from './ReporteVacuna';

export function Reportes({userDetails}) {
  const { fetchUserDetails, fetchStock, stock } = useAuth();
  const [todaysTraspasos, setTodaysTraspasos] = useState([]);
  const [vacunasConStock, setVacunasConStock] = useState([])
  const [eliminaciones, setEliminaciones] = useState([])

  useEffect(() => {
    fetchStock();
    fetchTodaysTraspasos()
    fetchAllEliminaciones();
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
      console.log('------todos los traspasos------');
      console.log(response.data);
      const todaysTraspasos = response.data.filter((traspaso) => {
        const traspasoDate = new Date(traspaso.fecha_traspaso).toDateString();
        return traspasoDate === today;
      });
      console.log('------ traspasos hoy------');
      console.log(todaysTraspasos);
      setTodaysTraspasos(todaysTraspasos);
    } catch (error) {
      console.error('Error fetching traspasos:', error);
    }
  };

  const fetchAllEliminaciones = async () => {
    try {
      const response = await getAllEliminaciones()
      setEliminaciones(response.data)
      return response.data
    } catch (error) {
      console.error('error en cargar todas las eliminaciones', error)
    }
  }

  if (!userDetails && !eliminaciones) {
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
        <h2 className="card-title fs-4 mt-2 text-success text-center">Reporte Diario</h2> <hr />
        <div className="card-body text-center" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {vacunasConStock.map((vacuna) => (
            <ReporteVacuna userDetails={userDetails} key={vacuna.id} vacuna={vacuna} traspasos={todaysTraspasos} eliminaciones={eliminaciones}/>
          ))}
        </div>
      </div>
    );
  }
}
