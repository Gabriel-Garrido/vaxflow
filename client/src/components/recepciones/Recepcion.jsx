import React, { useState, useEffect } from 'react';
import { getAllStock, getAllVacunatorios, createTraspaso, getAllUsuariosByVacunatorioId } from '../../api/inventario';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { logout } from '../../api/authentication';

export function Recepcion({ stock, userDetails, size }) {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [stockTraspaso, setStockTraspaso] = useState([]);
  const [vacunatorios, setVacunatorios] = useState([]);
  const [usuariosAsociados, setUsuariosAsociados] = useState([]);

  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    mode: 'all', // Habilitar validación en cada cambio
    defaultValues: {
      vacunatorio_destino: userDetails.vacunatorio,
      traspaso_recepcion: userDetails.id,
      cantidad_traspasada: 1, // Valor predeterminado para cantidad
    },
  });

  const cargarUsuariosAsociados = async (vacunatorioId) => {
    try {
      const response = await getAllUsuariosByVacunatorioId(vacunatorioId);
      setUsuariosAsociados(response.data);
    } catch (error) {
      console.error('Error fetching usuarios asociados:', error);
      navigate('/login');
    }
  };

  const cargarStockTraspaso = (vacunatorioId) => {
    const newStock = stocks.filter((stock) => {
      return vacunatorioId == stock.vacunatorio
    })
    console.log('--newStock--')
    console.log(newStock);
    setStockTraspaso(newStock)
  };

  const handleVacunatorioOrigenChange = (event) => {
    const selectedVacunatorioId = event.target.value;
    cargarUsuariosAsociados(selectedVacunatorioId);
    cargarStockTraspaso(selectedVacunatorioId)
  };

  useEffect(() => {
    setLoading(true);

    async function loadStocks() {
      try {
        const response = await getAllStock();
        setStocks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock:', error);
        navigate('/login');
        if (error.response && error.response.status === 401) {
          logout();
          setIsAuthenticated(false);
          navigate('/login');
        } else {
          setLoading(false);
        }
      }
    }

    async function loadVacunatorios() {
      setLoading(true);
      try {
        const res = await getAllVacunatorios();
        setVacunatorios(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock:', error);
        if (error.response && error.response.status === 401) {
          logout();
          setIsAuthenticated(false);
          setLoading(false);
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
      setLoading(false);
      navigate('/login');
    }
  }, [navigate, isAuthenticated, setIsAuthenticated]); // Asegúrate de que la autenticación sea una dependencia

  const selectedVacunaId = watch('vacuna_traspaso');
  const selectedStock = stocks.find((stock) => stock.id === selectedVacunaId);

  const onSubmit = handleSubmit(async (data) => {
    setProcessing(true);

    if (isAuthenticated) {
      // Convierte las cadenas en números
      data.cantidad_traspasada = parseInt(data.cantidad_traspasada, 10);
      data.responsable_recepcion = parseInt(data.traspaso_recepcion, 10);
      data.responsable_entrega = parseInt(data.traspaso_entrega, 10);
      data.vacunatorio_destino = parseInt(data.vacunatorio_destino, 10);

      if (!isNaN(data.cantidad_traspasada) && !isNaN(data.traspaso_recepcion)) {
        try {
          await createTraspaso(data);
          window.location.reload();

        } catch (error) {
          console.error('Error al crear el traspaso:', error);
        }
      } else {
        console.error('Los valores de cantidad y recepción no son números válidos.');
      }
    } else {
      console.error('User is not authenticated');
      // Puedes manejar el feedback al usuario
      navigate('/login');
    }
  });

  if (loading) {
    return (
      <button type="button" className="btn btn-success mb-1">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </button>
    );
  } else {
    return (
      <div key={stock.id} >
        {/* Botón "Recibir vacunas" */}
        <button
          type="button"
          className="btn btn-outline-success fs-4"
          data-bs-toggle="modal"
          data-bs-target={`#modalRecibir${size}`}
        >
          <div>
            <div className='text-center'><strong><i className="fa-regular fa-circle-down fs-6"></i> Recibir vacunas</strong></div>
          </div>
        </button>

        <div className="modal" tabIndex="-1" id={`modalRecibir${size}`} aria-labelledby={`modalRecibir${size}Label`} aria-hidden="true">
          <div className="modal-dialog modal-dialog-start">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`modalRecibir${size}Label`}>
                <div className='container text-center'><strong>Recibir vacunas</strong></div>
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body text-center">
                <div className="text-start">
                  {/* formulario */}
                  <div>
                    <form onSubmit={onSubmit} className="bg-dark p-4 rounded">
                      <div id={`carouselRecibir${size}`} className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                          <div className="carousel-item active">

                            {/* Vacunatorio de origen */}
                            <div className="mb-3">
                              <label htmlFor="vacunatorio" className="form-label text-light">
                                Vacunatorio de origen:
                              </label>
                              <select
                                id="vacunatorio"
                                name="vacunatorio"
                                {...register('vacunatorio_origen', { required: true })}
                                className="form-select"
                                onChange={handleVacunatorioOrigenChange}
                              >
                                <option value=""></option>
                                {vacunatorios.map((vacunatorio) => (
                                  // Filtra el vacunatorio actual del usuario
                                  userDetails.vacunatorio !== vacunatorio.id && (
                                    <option key={vacunatorio.id} value={vacunatorio.id}>
                                      {vacunatorio.nombre}
                                    </option>
                                  )
                                ))}
                              </select>
                              {errors.vacunatorio_origen && <p className="text-danger">Este campo es requerido</p>}
                            </div>

                            {/* Vacuna a recibir */}
                            <div className="mb-3">
                              <label htmlFor="vacuna_traspaso" className="form-label text-light">
                                Vacuna a recibir:
                              </label>
                              <select
                                id="vacuna_traspaso"
                                name="vacuna_traspaso"
                                {...register('vacuna_traspaso', { required: true })}
                                className="form-select"
                              >
                                <option value=""></option>
                                {stockTraspaso.map((stock) => (
                                  <option key={stock.id} value={stock.id}>
                                    {stock.nombre_vacuna} lote: {stock.lote}
                                  </option>
                                ))}
                              </select>
                              {errors.vacuna_traspaso && <p className="text-danger">Este campo es requerido</p>}
                            <p className='text-white'>Stock disponible: {stockTraspaso.find(v => v.id === parseInt(watch('vacuna_traspaso')))?.stock
                                }</p>
                            </div>


                            {/* Cantidad */}
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
                                  max: stockTraspaso.find(v => v.id === parseInt(watch('vacuna_traspaso')))?.stock
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

                            {/* Responsable de entrega */}
                            <div className="mb-3">
                              <label htmlFor="traspaso_entrega" className="form-label text-light">
                                Responsable de entrega:
                              </label>
                              <select
                                id="traspaso_entrega"
                                name="traspaso_entrega"
                                {...register('traspaso_entrega', { required: true })}
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
                              <button className="btn btn-primary me-2 fs-3 mt-2" type="button" data-bs-target={`#carouselRecibir${size}`} data-bs-slide="next" disabled={!isValid}>Realizar traspaso</button>
                            </div>
                          </div>
                          {/* Carousel page 2 */}
                          <div className="carousel-item">
                            {/* Resumen del traspaso */}
                            <div className="text-center text-white">
                              <h3>Resumen del Traspaso</h3>
                              <p>Recibirás {watch('cantidad_traspasada')} dosis de {selectedStock ? selectedStock.nombre_vacuna : 'Vacuna Desconocida'}</p>
                              <p>Desde: {vacunatorios.find(v => v.id === parseInt(watch('vacunatorio_origen')))?.nombre} </p>
                            </div>
                            {/* Boton */}
                            <div className="mb-3 text-center">
                            {processing ? (
                              <div className="spinner-border" role="status">
                                <span className="visually-impaired">Loading...</span>
                              </div>
                            ) : (
                                <div>
                                  <button className="btn btn-primary me-2 fs-3 mt-2" type="button" data-bs-target={`#carouselRecibir${size}`} data-bs-slide="prev">{"<"}
                                  </button>
                                  <button type="submit" disabled={!isValid} className="btn btn-primary me-2 fs-3 mt-2">
                                    Confirmar traspaso
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary mt-3 fs-3"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
