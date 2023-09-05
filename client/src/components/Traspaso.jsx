import React, { useState, useEffect } from 'react';
import { getAllStock, getAllVacunatorios, createTraspaso, getAllUsuariosByVacunatorioId } from '../api/inventario';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { logout } from '../api/authentication';

export function Traspaso({ stock }) {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [vacunatorios, setVacunatorios] = useState([]);
  const { isAuthenticated, setIsAuthenticated, userDetails } = useAuth()
  const [usuariosAsociados, setUsuariosAsociados] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    mode: 'all', // Habilitar validación en cada cambio
    defaultValues: {
      vacuna_traspaso: stock.id,
      cantidad_traspasada: 1, // Valor predeterminado para cantidad
    },
  });

  const cargarUsuariosAsociados = async (vacunatorioId) => {
    try {
      const response = await getAllUsuariosByVacunatorioId(vacunatorioId);
      setUsuariosAsociados(response.data);
      console.log(" carga usuarios", response.data);
    } catch (error) {
      console.error('Error fetching usuarios asociados:', error);
    }
  };

  const handleVacunatorioDestinoChange = (event) => {
    const selectedVacunatorioId = event.target.value;
    cargarUsuariosAsociados(selectedVacunatorioId);
  };

  useEffect(() => {
    console.log(stock);
    async function loadStocks() {
      try {
        const response = await getAllStock();
        console.log(response.data);
        setStocks(response.data);
      } catch (error) {
        console.error('Error fetching stock:', error);
        if (
          error.response &&
          error.response.status === 401
        ) {
          logout();
          setIsAuthenticated(false)
          navigate('/login');
        } else {
          setLoading(false);
        }
      }
    }
    
    async function loadVacunatorios() {
      try {
        const res = await getAllVacunatorios();
        setVacunatorios(res.data);
      } catch (error) {
        console.error('Error fetching stock:', error);
        if (
          error.response &&
          error.response.status === 401
        ) {
          logout();
          setIsAuthenticated(false)
          navigate('/login');
        } else {
          setLoading(false);
        }
      }

    }
    if (isAuthenticated) {
      loadStocks();
      loadVacunatorios();
    } else {
      navigate("/login")
    }
  }, [navigate]); // Asegúrate de que la autenticación sea una dependencia

  const selectedVacunaId = watch('vacuna_traspaso');
  const selectedStock = stocks.find(stock => stock.id === selectedVacunaId);

  const onSubmit = handleSubmit(async (data) => {
    if (isAuthenticated) {
      // Convierte las cadenas en números
      data.cantidad_traspasada = parseInt(data.cantidad_traspasada, 10);
      data.responsable_recepcion = parseInt(data.traspaso_recepcion, 10);
      data.responsable_entrega = parseInt(data.traspasos_entrega, 10);
      data.vacunatorio_destino = parseInt(data.vacunatorio_destino,10)
  
      if (!isNaN(data.cantidad_traspasada) && !isNaN(data.traspaso_recepcion)) {
        await createTraspaso(data);
        window.location.reload();
        navigate('/home');
      } else {
        console.error('Los valores de cantidad y recepción no son números válidos.');
      }
    } else {
      console.error('User is not authenticated');
      // Puedes manejar el feedback al usuario
      navigate("/login");
    }
  });




  return (
    <div>
      <form onSubmit={onSubmit} className="bg-dark p-4 rounded">
        <div id={`carousel${stock.id}`} className="carousel slide" data-bs-ride="carousel" >
          <div className="carousel-inner">
            <div className="carousel-item active">
              

  {/* Responsable de entrega: */}
              <div className="mb-3">
                <label htmlFor="traspaso_entrega" className="form-label text-light">
                  Responsable de entrega:
                </label>
                <select
                  id="traspaso_entrega"
                  name="traspaso_entrega"
                  value={userDetails.id}
                  {...register('traspasos_entrega', { required: true })}
                  className="form-select"
                >
                  <option value={userDetails.id}>{userDetails.name} {userDetails.last_name} {"("}{userDetails.vacunatorio_nombre}{")"}</option>
                </select>
                {errors.traspaso_entrega && <p className="text-danger">Este campo es requerido</p>}
              </div>


  {/* Vacuna a traspasar: */}
              <div className="mb-3">
                <label htmlFor="vacuna" className="form-label text-light">
                  Vacuna a traspasar:
                </label>
                <select
                  id="vacuna"
                  name="vacuna"
                  {...register('vacuna_traspaso', { required: true })}
                  className="form-select"
                  value={stock.id} 
                  disabled
                >
                  <option value={stock.vacuna}>{stock.nombre_vacuna} - Stock: {stock.stock}</option>
                </select>
                {errors.vacuna_traspaso && <p className="text-danger">Este campo es requerido</p>}
              </div>


  {/* Vacunatorio de destino: */}
              <div className="mb-3">
                <label htmlFor="vacunatorio" className="form-label text-light">
                  Vacunatorio de destino:
                </label>
                <select
                  id="vacunatorio"
                  name="vacunatorio"
                  {...register('vacunatorio_destino', { required: true })}
                  className="form-select"
                  onChange={handleVacunatorioDestinoChange}
                >
                  <option value=""></option>
                  {vacunatorios.map((vacunatorio) => (
                    // Filtra el vacunatorio actual del usuario
                    userDetails.vacunatorio !== vacunatorio.id && (
                      <option key={vacunatorio.id} value={vacunatorio.id}>
                        {vacunatorio.nombre}
                      </option>
                    ))
                  )}
                </select>
                {errors.vacunatorio_destino && <p className="text-danger">Este campo es requerido</p>}
              </div>


  {/* Cantidad: */}
              <div className="mb-3">
                <label htmlFor="cantidad" className="form-label text-light">
                  Cantidad:
                </label>
                <input
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  {...register('cantidad_traspasada', {
                    required: true,
                    min: 1,
                    max: selectedStock?.stock || Infinity,
                  })}
                  disabled={!selectedVacunaId}
                  className="form-control"
                />
                {errors.cantidad_traspasada && (
                  <p className="text-danger">
                    {errors.cantidad_traspasada.type === 'required' && 'Debe ingresar un número'}
                    {errors.cantidad_traspasada.type === 'min' && 'La cantidad debe ser mayor a 0'}
                    {errors.cantidad_traspasada.type === 'max' &&
                      'La cantidad no puede ser mayor al stock'}
                  </p>
                )}
              </div>


  {/* Responsable de recepción: */}
              <div className="mb-3">
                <label htmlFor="traspaso_recepcion" className="form-label text-light">
                  Responsable de recepción:
                </label>
                <select
                  id="traspaso_recepcion"
                  name="traspaso_recepcion"
                  {...register('traspaso_recepcion', { required: true })}
                  className="form-select"
                >
                  <option value=""></option>
                  {usuariosAsociados.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.name} {usuario.last_name}
                    </option>
                  ))}
                </select>
                {errors.traspaso_recepcion && <p className="text-danger">Este campo es requerido</p>}
              </div>
              <div className='text-center'>
                <button className="btn btn-primary me-2 fs-3 mt-2" type="button" data-bs-target={`#carousel${stock.id}`}data-bs-slide="next" disabled={!isValid}>Realizar traspaso
                </button>
              </div>
            </div>


  {/* Carousel page 2 */}
            <div className="carousel-item">

  {/* Resumen del traspaso */}
              <div className="text-center">
                <h3>Resumen del Traspaso</h3>
                <p>Traspasarás {watch('cantidad_traspasada')} dosis {stock.nombre_vacuna}</p>
                <p>Destino: {vacunatorios.find(v => v.id === parseInt(watch('vacunatorio_destino')))?.nombre} {"("+usuariosAsociados.find(u => u.id === parseInt(watch('traspaso_recepcion')))?.name+" "+usuariosAsociados.find(u => u.id === parseInt(watch('traspaso_recepcion')))?.last_name+")"}</p>
              </div>


  {/* Boton */}
              <div className="mb-3 text-center">
                <button className="btn btn-primary me-2 fs-3 mt-2" type="button" data-bs-target={`#carousel${stock.id}`} data-bs-slide="prev">{"<"}
                </button>
                <button type="submit" disabled={!isValid} className="btn btn-primary me-2 fs-3 mt-2">
                  Confirmar traspaso
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}