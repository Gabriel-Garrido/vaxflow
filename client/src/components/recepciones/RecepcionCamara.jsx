import React, { useState, useEffect } from 'react';
import { createTraspaso, getAllUsuariosByVacunatorioId, getAllStock, getAllVacunatorios } from '../../api/inventario';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { logout } from '../../api/authentication';

export function RecepcionCamara({ userDetails, size }) {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const [stockTraspaso, setStockTraspaso] = useState([]);
  const [usuariosAsociados, setUsuariosAsociados] = useState([])
  const [camara, setCamara] = useState([]);


  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    mode: 'all', 
    defaultValues: {
      traspaso_recepcion: userDetails.id,
      vacunatorio_origen: camara.id, 
      responsable_traspaso: usuariosAsociados.id
    },
  });

  const cargarUsuariosAsociados = async (vacunatorioId) => {
    try {
      const response = await getAllUsuariosByVacunatorioId(vacunatorioId);
      setUsuariosAsociados(response.data[0]);
      console.log("usuariosAsociados");
      console.log(response.data[0]);
    } catch (error) {
      console.error('Error fetching usuarios asociados:', error);
      navigate('/login');
    }
  };

  useEffect(() => {
    setLoading(true);

    async function loadStockTraspaso() {
      try {
        
        const res = await getAllVacunatorios()
        const vacunatorios = res.data
        const camara = vacunatorios.filter((vacunatorio) => {
          return vacunatorio.nombre == "camara"
        })
        console.log("camara[0]");    
        console.log(camara[0]);
        cargarUsuariosAsociados(camara[0].id);
        setCamara(camara[0])

        const responseStock = await getAllStock();
        console.log("responseStock.data");
        console.log(responseStock.data);
        const stockCamara = responseStock.data.filter((stock) => {
          return stock.vacunatorio === camara[0].id;
        });
        console.log("stockCamara"); 
        console.log(stockCamara);
        setStockTraspaso(stockCamara);


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

    if (isAuthenticated) {
      loadStockTraspaso();
      // Carga usuarios asociados a "camara"
      
    } else {
      setLoading(false);
      navigate('/login');
    }
  }, [navigate, isAuthenticated, setIsAuthenticated]);

  const selectedVacunaId = watch('vacuna_traspaso');

  const onSubmit = handleSubmit(async (data) => {
    setProcessing(true);

    if (isAuthenticated) {
      // Convierte las cadenas en números
      data.cantidad_traspasada = parseInt(data.cantidad_traspasada, 10);
      data.responsable_entrega = parseInt(usuariosAsociados.id)
      data.vacunatorio_origen = parseInt(camara.id)
      data.vacunatorio_destino = parseInt(userDetails.vacunatorio)
      data.responsable_recepcion = parseInt(data.traspaso_recepcion, 10);

      if (!isNaN(data.cantidad_traspasada) && !isNaN(data.traspaso_recepcion)) {
        try {
          // Realiza el traspaso directamente, sin importar el stock del vacunatorio de origen
          await createTraspaso(data);
          window.location.reload();
        } catch (error) {
          console.error('Error al crear el traspaso:', error);
        }
      } else {
        console.error('Los valores de cantidad y recepción no son números válidos.');
        setProcessing(false);
      }
    } else {
      console.error('User is not authenticated');
      // Puedes manejar el feedback al usuario
      navigate('/login');
      setProcessing(false);
    }
  });

  const handleVacunaTraspasoChange = (e) => {
    const selectedVacunaId = e.target.value;
    setValue('vacuna_traspaso', parseInt(selectedVacunaId)); 
  };

  return (
    <div>
      {/* Botón "Recibir vacunas" */}
      <button
        type="button"
        className="btn btn-outline-success fs-4"
        data-bs-toggle="modal"
        data-bs-target={`#modalRecibirCamara${size}`}
      >
        <div>
          <div className='text-center'><strong><i class="fa-solid fa-snowflake fs-6"></i> Recibir de camara</strong></div>
        </div>
      </button>

      <div className="modal" tabIndex="-1" id={`modalRecibirCamara${size}`} aria-labelledby={`modalRecibirCamara${size}Label`} aria-hidden="true">
        <div className="modal-dialog modal-dialog-start">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`modalRecibirCamara${size}Label`}>
                <div className='container text-center'><strong>Recibir vacunas camara</strong></div>
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center">
              <div className="text-start">
                {/* formulario */}
                <div>
                  <form onSubmit={onSubmit} className="bg-dark p-4 rounded">
                    <div id={`carouselRecibirCamara${size}`} className="carousel slide" data-bs-ride="carousel">
                      <div className="carousel-inner">
                        <div className="carousel-item active">
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
                              onChange={handleVacunaTraspasoChange}
                            >
                              <option value=""></option>
                              {stockTraspaso.map((stock) => (
                                <option key={stock.id} value={parseInt(stock.id)}>
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
                              })}
                              disabled={!selectedVacunaId}
                              className="form-control"
                            />
                            {errors.cantidad_traspasada && (
                              <p className="text-danger">
                                {errors.cantidad_traspasada.type === 'required' && 'Debe ingresar un número'}
                                {errors.cantidad_traspasada.type === 'min' && 'La cantidad debe ser mayor a 0'}
                              </p>
                            )}
                          </div>

                          <div className='text-center'>
                            <button className="btn btn-primary me-2 fs-3 mt-2" type="button" data-bs-target={`#carouselRecibirCamara${size}`} data-bs-slide="next" disabled={!isValid}>Realizar traspaso</button>
                          </div>
                        </div>
                        {/* Carousel page 2 */}
                        <div className="carousel-item">
                          {/* Resumen del traspaso */}
                          <div className="text-center text-white">
                            <h3>Resumen del Traspaso</h3>
                            <p>Recibirás {watch('cantidad_traspasada')} dosis de {stockTraspaso.find(v => v.id === parseInt(watch('vacuna_traspaso')))?.nombre_vacuna}</p>
                            <p>Desde: {camara.nombre}</p>
                          </div>
                          {/* Boton */}
                          <div className="mb-3 text-center">
                            {processing ? (
                              <div className="spinner-border" role="status">
                                <span className="visually-impaired">Loading...</span>
                              </div>
                            ) : (
                              <div>
                                <button className="btn btn-primary me-2 fs-3 mt-2" type="button" data-bs-target={`#carouselRecibirCamara${size}`} data-bs-slide="prev">{"<"}
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
            </div>
            <div className='text-center'>
            <button
              type="button"
              className="btn btn-secondary mb-3 fs-3"
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
