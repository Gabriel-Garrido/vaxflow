import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import moment from 'moment';

export function ReporteVacuna({ vacuna, userDetails, traspasos, eliminaciones, administraciones, stock, retirosCamara }) {
  const [enviadas, setEnviadas] = useState([]);
  const [recibidas, setRecibidas] = useState([]);
  const [eliminadas, setEliminadas] = useState([]);
  const [administradas, setAdministradas] = useState([])
  const [loading, setLoading] = useState(true);
  const [stockInicial, setStockInicial] = useState(0);
  const [retiradasCamara, setRetiradasCamara] = useState([])

  useEffect(() => {
    setLoading(true)
    getEnviadas();
    getRecibidas();
    getEliminadas();
    getAdministradas()
    totalStockInicial();
    getRetirosCamara()
    
    setLoading(false)
  }, [traspasos, eliminaciones, vacuna, userDetails, stock]);

  function totalStockInicial() {
    const totalCantidadEliminada = eliminadas.reduce((acumulador, eliminacion) => {
      return acumulador + eliminacion.cantidad_eliminada;
    }, 0);
    const totalCantidadAdministrada = administradas.reduce((acumulador, administracion) => {
      return acumulador + administracion.cantidad_administrada;
    }, 0);
    const totalCantidadEnviadas = enviadas.reduce((acumulador, administracion) => {
      return acumulador + administracion.cantidad_traspasada;
    }, 0);
    const totalCantidadRecibidas = recibidas.reduce((acumulador, recepcion) => {
        return acumulador + recepcion.cantidad_traspasada;
      }, 0);
    const totalCantidadRetiradaCamara = retiradasCamara.reduce((acumulador, retiro) => {
      return acumulador + retiro.cantidad_retiro;
    }, 0);

  
    setStockInicial(
      vacuna.stock + totalCantidadEliminada + totalCantidadEnviadas + totalCantidadAdministrada - totalCantidadRecibidas - totalCantidadRetiradaCamara

    );
    setLoading(false);
  }
  

  function getEnviadas() {
    const today = new Date().toDateString();
    const enviosHoy = traspasos.filter((traspaso) => {
     
      return (
        new Date(traspaso.fecha_traspaso).toDateString() === today &&
        traspaso.vacunatorio_origen === userDetails.vacunatorio &&
        traspaso.vacuna_traspaso === vacuna.id
      );
    });
    
    setEnviadas(enviosHoy);
  }

  function getRecibidas() {
    const today = new Date().toDateString();
    const recibosHoy = traspasos.filter((traspaso) => {
      console.log('------traspaso.vacunatorio_destino');
    console.log(traspaso.vacunatorio_destino);
    
    console.log('------userDetails.vacunatorio');
    console.log(userDetails.vacunatorio);
    
    console.log('------traspaso.vacuna_traspaso');
    console.log(traspaso.vacuna_traspaso);
    
    console.log('------vacuna.id');
    console.log(vacuna.id);
    
      return (
        new Date(traspaso.fecha_traspaso).toDateString() === today &&
        traspaso.vacunatorio_destino === userDetails.vacunatorio &&
        traspaso.vacuna_traspaso_nombre === vacuna.nombre_vacuna && traspaso.vacuna_traspaso_lote === vacuna.lote && traspaso.vacuna_traspaso_fecha_caducidad_descongelacion === vacuna.fecha_descongelacion 

      );
    });
    console.log('------recibosHoy');
    console.log(recibosHoy);
    
    setRecibidas(recibosHoy);
  }

  function getRetirosCamara() {
    const today = moment().format('DD-MM-YYYY'); // Formato dd-mm-yyyy
    const retirosCamaraHoy = retirosCamara.filter((retiro) => {
      const fechaRetiro = moment(retiro.fecha_retiro);
      const formattedFechaRetiro = fechaRetiro.format('DD-MM-YYYY'); // Formato dd-mm-yyyy
  
      // Agregamos la condición para filtrar por vacunatorio y vacuna
      const cumpleCondicion = (
        formattedFechaRetiro === today &&
        retiro.vacunatorio === userDetails.vacunatorio && retiro.vacuna_retiro === vacuna.id

        
      );
  
      return cumpleCondicion;
    });

    setRetiradasCamara(retirosCamaraHoy);
  }
  
  

  async function getEliminadas() {
    const today = new Date().toDateString();
    const eliminacionesHoy = eliminaciones.filter((eliminacion) => {
      return new Date(eliminacion.fecha).toDateString() === today && vacuna.id === eliminacion.vacuna;
    });
    setEliminadas(eliminacionesHoy);;
  }

  async function getAdministradas() {
    const today = new Date().toDateString();
    const administracionesHoy = administraciones.filter((administracion) => {
      return new Date(administracion.fecha).toDateString() === today && vacuna.id === administracion.vacuna;
    });
    setAdministradas(administracionesHoy);
  }

  const today = new Date().toDateString();

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
      
      <div className="card border-dark mb-3 border-white border-top">
        <ul className="list-group fs-5 list-group-flush text-start">

        <strong className="card-title text-success fs-6 mt-2">
          {vacuna.nombre_vacuna} {vacuna.lote}
        </strong>
        {vacuna.fecha_caducidad_descongelacion && (
          <p className="card-title text-success fs-7 mt-0">Vigencia descong: {format(new Date(`${vacuna.fecha_caducidad_descongelacion}T${vacuna.hora_descongelacion}`), 'dd MMM yyyy HH:mm', { locale: es })}</p>
        )}
        {!vacuna.fecha_caducidad_descongelacion && (
          <h6 className="card-title text-success fs-7 mt-0 ">Vigencia fabr: {format(parseISO(vacuna.caducidad_fabricante), 'dd MMM yyyy')}</h6>
        )}
        <>
          <li key={`inicial${vacuna.id}`} className="list-group-item">
            <strong>Stock Inicial:</strong> {stockInicial}
          </li>
        </>

        {retiradasCamara.length > 0 && (
          <>
            {retiradasCamara.map((retiroCamara) => (
              <li key={`retiroCamara${retiroCamara.id}`} className="list-group-item">
                <i class="fa-solid fa-snowflake fs-6"></i> Retiradas de cámara: {retiroCamara.cantidad_retiro}
              </li>
            ))}
          </>
        )}
        
        {recibidas.length > 0 && (
          <>
            {recibidas.map((traspaso) => (
              <li key={`recibida${traspaso.id}`} className="list-group-item">
                <i className="fa-regular fa-circle-down fs-6"></i> Recibidas de{' '}
                {traspaso.vacunatorio_origen_nombre}: {traspaso.cantidad_traspasada}
              </li>
            ))}
          </>
        )}
        {enviadas.length > 0 && (
          <>
            {enviadas.map((traspaso) => (
              <li key={`enviada${traspaso.id}`} className="list-group-item">
                <i className="fa-regular fa-paper-plane fs-6"></i> Entregadas a{' '}
                {traspaso.vacunatorio_destino_nombre}: {traspaso.cantidad_traspasada}
              </li>
            ))}
          </>
        )}
        {administradas.length > 0 && (
          <>
            {administradas.map((administracion) => (
              <li key={administracion.id} className="list-group-item">
                <i className="fa-solid fa-syringe fs-6"></i> Administradas:{' '}
                {administracion.cantidad_administrada}
              </li>
            ))}
          </>
        )}
        {eliminadas.length > 0 && (
          <>
            {eliminadas.map((eliminacion) => (
              <li key={eliminacion.id} className="list-group-item">
                <i className="fa-regular fa-trash-alt fs-6"></i> Eliminadas:{' '}
                {eliminacion.cantidad_eliminada}
              </li>
            ))}
          </>
        )}
        <>
          <li key={`final${vacuna.id}`} className="list-group-item">
          <strong>Stock Final:</strong> {vacuna.stock}
          </li>
        </>
        </ul>
      </div>
    );
  }
}
