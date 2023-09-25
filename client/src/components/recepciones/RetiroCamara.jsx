import React, { useState, useEffect } from 'react';
import { createVacuna, createVacunaStock, getAllVacunas, createRetiroCamara } from '../../api/inventario';
import { useForm } from 'react-hook-form';

export function RetiroCamara({ userDetails, size, stock }) {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [vacunas, setVacunas] = useState([]);
  const [error, setError] = useState(null)
  const [vacunaSeleccionada, setVacunaSeleccionada] = useState([])
  const [lotesVacunaSeleccionada, setLotesVacunaSeleccionada] = useState([])
  const [fechasLoteSeleccionado, setFechasLoteSeleccionado] = useState([])
  const [vacunaOtraSeleccionada, setVacunaOtraSeleccionada] = useState([])
  const [inputCongelacion, setInputCongelacion] = useState(false)
  const [nombreVacunaOtroActive, setNombreVacunaOtroActive] = useState(false);
  const [loteOtro, setLoteOtro] = useState(false);
  const [fechaCaducidadFabricanteOtro, setFechaCaducidadFabricanteOtro] = useState(false)
  const [nuevaVacuna, setNuevaVacuna] = useState([])
  

  useEffect(() => {
    async function loadVacunas() {
      try {
        const response = await getAllVacunas();
        setVacunas(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vacunas:', error);
        setError('Error fetching vacunas')
        setLoading(false);
      }
    }

    loadVacunas();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm({
    mode: 'onBlur', // Validar cuando se sale de un campo
  });

  const onSubmit = async (data) => {
    setProcessing(true);
  
    if (!isValid) {
      console.error('Formulario no válido');
      setError('Formulario no válido');
      setProcessing(false); // Agrega esto para detener el procesamiento en caso de error
      return;
    }
  
    let vacunaDataId = null;
  
    const nombreVacunaEnviar = data.nombreVacunaOtro || data.nombreVacuna;
    const loteEnviar = data.loteOtro || data.lote;
    const fechaCaducidadEnviar = data.fechaCaducidadFabricanteOtro || data.fechaCaducidadFabricante;
  
    const vacunaEncontrada = vacunas.find((vacuna) => {
      return (
        vacuna.nombre === nombreVacunaEnviar &&
        vacuna.fecha_caducidad_fabricante === fechaCaducidadEnviar &&
        vacuna.lote === loteEnviar &&
        vacuna.congelacion === inputCongelacion
      );
    });
  
    console.log('---vacunaEncontrada----');
    console.log(vacunaEncontrada);
  
    if (!vacunaEncontrada) {
      const nuevaVacunaData = {
        nombre: nombreVacunaEnviar,
        lote: loteEnviar,
        fecha_caducidad_fabricante: fechaCaducidadEnviar,
        congelacion: inputCongelacion,
        // Agrega otros campos del formulario aquí
      };
      console.log('---nuevaVacunaData----');
      console.log(nuevaVacunaData);
  
      try {
        const vacunaCreada = await createVacuna(nuevaVacunaData);
        setNuevaVacuna(vacunaCreada);
        console.log('---vacunaCreada----');
        console.log(vacunaCreada);
        vacunaDataId = vacunaCreada.id;
      } catch (error) {
        console.error('Error al crear el registro de crearVacuna:', error);
        setError('Error al crear el registro de crearVacuna');
        console.log(error);
        setProcessing(false);
        return; // Agrega esto para detener la ejecución en caso de error
      }
    } else {
      vacunaDataId = vacunaEncontrada.id;
    }
  
    const vacunaStockData = {
      tipo_vacuna: vacunaDataId,
      vacunatorio: userDetails.vacunatorio,
      stock: parseInt(data.stock),
      fecha_descongelacion: data.fecha_descongelacion || null,
      fecha_caducidad_descongelacion: data.fecha_caducidad_descongelacion || null,
      hora_descongelacion: data.hora_descongelacion || null,
    };
  
    const nuevoRetiroData = {
      cantidad_retiro: parseInt(data.stock),
      vacuna_retiro: vacunaDataId,
      vacunatorio: userDetails.vacunatorio,
    };
  
    try {
      await createVacunaStock(vacunaStockData);
      await createRetiroCamara(nuevoRetiroData);
      window.location.reload();
    } catch (error) {
      console.error('Error al crear el registro de vacunaStock:', error);
      setError('Error al crear el registro de vacunaStock');
      console.log(error);
      setProcessing(false);
    }
  };
  

  const handleVacunaNombreChange = (event) => {
    const selectedVacunaNombre = event.target.value;
    setValue('nombreVacunaOtro', event.target.value)
    setInputCongelacion(false)
    setVacunaOtraSeleccionada('')
    if (selectedVacunaNombre === "Otro") {
      reset()
      setValue('nombreVacuna', 'Otro')
      setNombreVacunaOtroActive(true);
    } else {
      setNombreVacunaOtroActive(false);
    }
    const vacunaSeleccionada = vacunas.filter((vacuna) => {
      return vacuna.nombre == selectedVacunaNombre;
    });
    setVacunaSeleccionada(vacunaSeleccionada);
    console.log(vacunaSeleccionada);
    const lotesVacunaSeleccionada = vacunaSeleccionada.map((vacuna) => {
      return vacuna.lote;
    });
    setLotesVacunaSeleccionada(lotesVacunaSeleccionada);
  };


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
      <div key={"camara" + stock.id}>
        {/* Botón "Retirar vacunas de camara" */}
        <button
          type="button"
          className="btn btn-outline-success fs-4"
          data-bs-toggle="modal"
          data-bs-target={`#modalRecibirCamara${size}`}
        >
          <div>
            <div className='text-center'><strong><i className="fa-regular fa-circle-down fs-6"></i> Retirar vacunas</strong></div>
          </div>
        </button>

        <div className="modal" tabIndex="-1" id={`modalRecibirCamara${size}`} aria-labelledby={`modalRecibirCamara${size}Label`} aria-hidden="true">
          <div className="modal-dialog modal-dialog-start lh-1 fs-4">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`modalRecibirCamara${size}Label`}>
                  <div className='container text-center'><strong>Retiro de camara</strong></div>
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body text-center">
                <div className="text-start">
                  {/* formulario */}
                  <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-dark p-1 rounded ">
                      {/* Nombre de la Vacuna */}
                      <div className="mb-3">
                        <label htmlFor="tipo_vacuna" className="form-label text-light">
                          Nombre Vacuna
                        </label>
                        <select
                          id="nombreVacuna"
                          name="nombreVacuna"
                          {...register('nombreVacuna', { required: true })}
                          className="form-select"
                          onChange={handleVacunaNombreChange}
                        >
                          <option value=""></option>
                          {vacunas
                            .filter(
                              (vacuna, index, self) =>
                                self.findIndex((v) => v.nombre === vacuna.nombre) === index
                            )
                            .map((vacuna) => (
                              <option key={vacuna.nombre} value={vacuna.nombre}>
                                {vacuna.nombre}
                              </option>
                            ))}
                          <option value="Otro">Otro nombre vacuna</option> 
                          {/* Agregar la opción "Otro" */}
                        </select>
                        {errors.nombreVacuna && <p className="text-danger">Este campo es requerido</p>}


                        {nombreVacunaOtroActive && ( 
                          
                          // Mostrar el campo de texto si se selecciona "Otro"

                          <div className='row container'>
                          <input
                            type="text"
                            id="nombreVacunaOtro"
                            name="nombreVacunaOtro"
                            placeholder="Escriba nombre de vacuna"
                            {...register('nombreVacunaOtro', { required: true })}
                            className="form-control border-success mt-2 "
                            onChange={(e) => {
                              const vacunaOtraSeleccionada = vacunas.filter((vacuna) => { return vacuna.nombre == e.target.value })
                              console.log(vacunaOtraSeleccionada);
                              const lotesvacunaOtraSeleccionada = vacunaOtraSeleccionada.map((vacuna) => {
                                return vacuna.lote;
                              });
                              setVacunaOtraSeleccionada(vacunaOtraSeleccionada)

                              setLotesVacunaSeleccionada(lotesvacunaOtraSeleccionada)
                                ;
                            
                            }}
                            
                          />
                          {errors.nombreVacunaOtro && <p className="text-danger">Este campo es requerido</p>}
                          
                          <div className='container row  mt-2 mx-2 px-5'>
                          <label htmlFor="congelacionInput" className="col-form-label col text-white">Se congelan en camara?</label>
                              <select
                                id='congelacionInput'
                                className="form-select border-success col"
                                aria-label="Default select example"
                                {...register('congelacion', { required: true })}
                                onChange={(e) => {
                                  let isCongelada = e.target.value === 'true'; // Convierte el valor del select en un booleano
                                  setInputCongelacion(isCongelada);
                                }}
                              >
                                
                                <option defaultValue value="false">No</option>
                                <option value="true">Sí</option>
                              </select>
                              </div>

                          </div>
                        )}
                        {errors.tipo_vacuna && <p className="text-danger">Este campo es requerido</p>}
                      </div>

                      {/* Lote */}
                      <div className="mb-3">
                        <label htmlFor="lote" className="form-label text-light">
                          Lote:
                        </label>
                        <select
                          type="text"
                          id="lote"
                          name="lote"
                          {...register('lote', { required: true })}
                          className="form-select"
                          onChange={(event) => {
                            if (event.target.value === "Otro") {
                              setLoteOtro(true);
                            } else {
                              console.log(event.target.value);
                              setLoteOtro(false);
                              const vacunasLoteSeleccionado = vacunas.filter((vacuna) => {
                                if (vacuna.lote == event.target.value) {
                                  return vacuna.lote
                                }
                              })
                              console.log(vacunasLoteSeleccionado);
                              const fechasLoteSeleccionado = vacunasLoteSeleccionado.map((vacuna) => {
                                return vacuna.fecha_caducidad_fabricante
                              })
                              console.log(fechasLoteSeleccionado);
                              setFechasLoteSeleccionado(fechasLoteSeleccionado)
                            }

                          }}
                        
                        >
                          <option value=""></option>
                          {lotesVacunaSeleccionada.map((lote,i) => (
                            <option key={'lote' + i} value={lote}>
                              {lote}
                            </option>
                          ))}

                          <option value="Otro">Otro</option> 
                          {/* Agregar la opción "Otro" */}
                        </select>
                        {loteOtro && (
                          <div className='row container'>
                          <input
                            type="text"
                            id="loteOtro"
                            name="loteOtro"
                            placeholder="Escriba el lote de la vacuna"
                            {...register('loteOtro', { required: true })}
                            className="form-control border-success"
                          /></div>
                        )}
                        {errors.lote && <p className="text-danger">Este campo es requerido</p>}
                      </div>

                      {/* Fecha de Caducidad del Fabricante */}
                      <div className="mb-3">
                        <label htmlFor="fechaCaducidadFabricante" className="form-label text-light">
                          Fecha de Caducidad del Fabricante:
                        </label>
                        <select
                          id="fechaCaducidadFabricante"
                          name="fechaCaducidadFabricante"
                          {...register('fechaCaducidadFabricante', { required: true })}
                          className="form-select"
                          onChange={(event) => {
                            if (event.target.value === "Otro") {
                              setFechaCaducidadFabricanteOtro(true);
                            } else {
                              setFechaCaducidadFabricanteOtro(false);
                            }
                          }}
                        >
                          <option value=""></option>
                          {fechasLoteSeleccionado.map((fecha, i) => (
                            <option key={'fecha' + i} value={fecha}>
                              {fecha}
                            </option>
                          ))}
                          <option value="Otro">Otras fechas</option> {/* Agregar la opción "Otras fechas" */}
                        </select>
                        {fechaCaducidadFabricanteOtro && ( // Mostrar el campo de entrada de fecha si se selecciona "Otras fechas"
                        <div className='row container'>
                          <input
                            type="date"
                            id="fechaCaducidadFabricanteOtro"
                            name="fechaCaducidadFabricanteOtro"
                            {...register('fechaCaducidadFabricanteOtro', { required: true })}
                            className="form-control border-success"
                          /></div>
                        )}
                        {errors.fechaCaducidadFabricante && <p className="text-danger">Este campo es requerido</p>}
                      </div>


                      {/* Cantidad */}
                      <div className="mb-3">
                        <label htmlFor="stock" className="form-label text-light">
                          Cantidad retirada:
                        </label>
                        <input
                          type="number"
                          id="stock"
                          name="stock"
                          {...register('stock', { required: true, min: 1 })}
                          className="form-control"
                        />
                        {errors.stock && (
                          <p className="text-danger">
                            {errors.stock.type === 'required' && 'Este campo es requerido'}
                            {errors.stock.type === 'min' && 'El stock debe ser mayor o igual a 1'}
                          </p>
                        )}
                      </div>

                      {vacunaSeleccionada[0]?.congelacion || vacunaOtraSeleccionada[0]?.congelacion || inputCongelacion == true?
                        <div className='container bg-black '>
                          <hr />
                          {/* Fecha de Descongelación */}
                          <div className="mb-3">
                            <label htmlFor="fecha_descongelacion" className="form-label text-light">
                              Fecha de Descongelación:
                            </label>
                            <input
                              type="date"
                              id="fecha_descongelacion"
                              name="fecha_descongelacion"
                              {...register('fecha_descongelacion', { required: true })}
                              className="form-control"
                            />
                          </div>

                          {/* Fecha de Caducidad de Descongelación */}
                          <div className="mb-3">
                            <label htmlFor="fecha_caducidad_descongelacion" className="form-label text-light">
                              Fecha de Caducidad de Descongelación:
                            </label>
                            <input
                              type="date"
                              id="fecha_caducidad_descongelacion"
                              name="fecha_caducidad_descongelacion"
                              {...register('fecha_caducidad_descongelacion', { required: true })}
                              className="form-control"
                            />
                          </div>

                          {/* Hora de Descongelación */}
                          <div className="mb-3">
                            <label htmlFor="hora_descongelacion" className="form-label text-light">
                              Hora de Descongelación:
                            </label>
                            <input
                              type="time"
                              id="hora_descongelacion"
                              name="hora_descongelacion"
                              {...register('hora_descongelacion', { required: true })}
                              className="form-control"
                            />
                          </div>
                          <hr />
                        </div> : <></>}

                      {error ? <span key={"error" + stock.id} className='text-danger'>{error}</span> : <></>}

                      {isValid ? <div className='text-center'>
                        <button
                          type="submit"
                          className={processing?'spinner-border btn btn-primary me-2 fs-3 mt-2':"btn btn-primary me-2 fs-3 mt-2"}
                          disabled={processing}
                        >
                          {processing ? 'Procesando...' : 'Realizar Retiro'}
                        </button>
                      </div> : <div className='text-center'>
                        <button
                          className="btn btn-secondary me-2 fs-3 mt-2"
                          disabled
                        >
                          
                          Realizar Retiro
                        </button>
                      </div>}
                    </form>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
