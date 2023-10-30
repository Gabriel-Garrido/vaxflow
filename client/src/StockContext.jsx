import React, { createContext, useContext, useState, useEffect } from 'react';
import { logout } from './api/authentication';
import { getAllInventarioVacuna, getAllVacunatorios, getAllVacunas } from './api/inventario';
import { useAuth } from './AuthContext';

const StockContext = createContext();

export function StockProvider({ children }) {
  const [stock, setStock] = useState([]);
  const [isLoadingStock, setIsLoadingStock] = useState(true);
  const { userDetails, isAuthenticated } = useAuth();
  const [stockPorVacunatorio, setStockPorVacunatorio] = useState([]);
  const [vacunatorios, setVacunatorios] = useState([])
  const [vacunas, setVacunas] = useState([])

  useEffect(() => {
    if (userDetails && isAuthenticated) {
      fetchData();
    } else {
      setIsLoadingStock(false);
    }
  }, [userDetails, isAuthenticated]);

  useEffect(() => {
    createStockPorVacunatorio();
  }, [stock]);

  const fetchData = async () => {
    try {
      const dataVacunatorios = await getAllVacunatorios()
      setVacunatorios(dataVacunatorios.data)
    } catch (error) {
      console.error("error en dataVacunatorios en StockContext", error)
    }
    try {
      const dataVacunas = await getAllVacunas()
      setVacunas(dataVacunas.data)
    } catch (error) {
      console.error("error en dataVacunas en StockContext", error)
    }
    try {
      const response = await getAllInventarioVacuna();
      setStock(response.data);
      setIsLoadingStock(false);
    } catch (error) {
      console.error('Error fetching stock en StockContext:', error);
      if (error.response && error.response.status === 401) {
        logout();
      }
      setIsLoadingStock(false);
    }
  };

  const createStockPorVacunatorio = () => {
    const agrupaStockPorVacunatorio = [];

    stock.forEach((item, i) => {
      const existingItem = agrupaStockPorVacunatorio.find(
        (x) => x.vacuna === item.vacuna && x.lote === item.lote && x.fecha_caducidad_fabricante === item.fecha_caducidad_fabricante
      );

      if (existingItem) {
        existingItem.cantidad++;
      } else {
        agrupaStockPorVacunatorio.push({
          id: i,
          vacuna: item.vacuna,
          vacuna_nombre: item.vacuna_nombre,
          lote: item.lote,
          cantidad: 1,
          vacunatorio: item.vacunatorio,
          caducidad_fabricante: item.fecha_caducidad_fabricante,
          fecha_caducidad_descongelacion: item.fecha_caducidad_descongelacion,
          hora_descongelacion: item.hora_descongelacion

        });
      }
    });
    setStockPorVacunatorio(agrupaStockPorVacunatorio);
  };

//  console.log("vacunatorios", vacunatorios);
  // console.log("vacunas", vacunas);

  return (
    <StockContext.Provider value={{ stock, isLoadingStock, stockPorVacunatorio, vacunas, vacunatorios }}>
      {isLoadingStock ? (
        <div>
          <div className="text-center mt-6">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </StockContext.Provider>
  );
}
export function useStock() {
  return useContext(StockContext);
}
