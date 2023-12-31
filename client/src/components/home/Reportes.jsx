import React, { useEffect, useState } from 'react';
import { getAllAdministraciones, getAllEliminaciones, getAllRetirosCamara, getAllTraspasos } from '../../api/inventario';
import { useStock } from '../../StockContext';
import { ReporteVacuna } from './ReporteVacuna';

export function Reportes({ userDetails }) {
  const { stock } = useStock();
  const [todaysTraspasos, setTodaysTraspasos] = useState([]);
  const [eliminaciones, setEliminaciones] = useState([]);
  const [administraciones, setAdministraciones] = useState([])
  const [vacunasConStock, setVacunasConStock] = useState([]);
  const [retirosCamara, setRetirosCamara] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // Fecha actual por defecto

  
  useEffect(() => {
    fetchTodaysTraspasos();
    fetchAllEliminaciones();
    fetchAllAdministraciones();
    fetchAllRetirosCamara();
  }, [userDetails]);

  useEffect(() => {
    const vacunasFiltradas = stock.filter((vacuna) => vacuna.vacunatorio === userDetails.vacunatorio);
    setVacunasConStock(vacunasFiltradas);
  }, [stock, userDetails]);

  const fetchTodaysTraspasos = async () => {
    try {
      const response = await getAllTraspasos();
      const today = new Date().toDateString();
      const todaysTraspasos = response.data.filter((traspaso) => {
        return (
          new Date(traspaso.fecha_traspaso).toDateString() === today &&
          (traspaso.vacunatorio_destino === userDetails.vacunatorio || traspaso.vacunatorio_origen === userDetails.vacunatorio)
        );
      });   

      setTodaysTraspasos(todaysTraspasos);
    } catch (error) {
      console.error('Error fetching traspasos:', error);
    }
  };

  const fetchAllEliminaciones = async () => {
    try {
      const response = await getAllEliminaciones();
      setEliminaciones(response.data);
    } catch (error) {
      console.error('Error en cargar todas las eliminaciones', error);
    }
  };

  const fetchAllRetirosCamara = async () => {
    try {
      const response = await getAllRetirosCamara();
      setRetirosCamara(response.data);
    } catch (error) {
      console.error('Error en cargar todas los retiros de cámara', error);
    }
  };

  const fetchAllAdministraciones = async () => {
    try {
      const response = await getAllAdministraciones();
      setAdministraciones(response.data);
    } catch (error) {
      console.error('Error en cargar todas las administraciones', error);
    }
  };

  if (!userDetails || !eliminaciones || !administraciones || !todaysTraspasos) {
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
        <h2 className="card-title fs-4 mt-2 text-success text-center">
          Reporte Diario
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </h2>
        <div className="card-body text-center" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {vacunasConStock.map((vacuna) => (
            !eliminaciones || !administraciones || !todaysTraspasos || !vacuna || !stock || !retirosCamara || !userDetails ?
              <>
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Loading...</p>
                </div>
              </> :
              <ReporteVacuna userDetails={userDetails} key={vacuna.id} vacuna={vacuna} traspasos={todaysTraspasos} eliminaciones={eliminaciones} administraciones={administraciones} stock={stock} retirosCamara={retirosCamara} selectedDate={selectedDate} />
          ))}
        </div>
      </div>
    );
  }
}
