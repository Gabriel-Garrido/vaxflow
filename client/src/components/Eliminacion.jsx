import React, { useState } from 'react';
import { createEliminacionVacuna } from '../api/inventario';
import { useForm } from 'react-hook-form';
import { useAuth } from '../AuthContext';

export function Eliminacion({ stock, size }) {
  const [processing, setProcessing] = useState(false);
  const { userDetails } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    mode: 'all',
    defaultValues: {
      vacuna_traspaso: stock.id,
      cantidad_eliminada: 1,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setProcessing(true);

      const eliminacionVacunaData = {
        vacuna: data.vacuna_traspaso,
        cantidad_eliminada: parseInt(data.cantidad_eliminada),
        responsable_eliminacion: userDetails.id,
        vacunatorio_eliminacion: userDetails.vacunatorio,
      };

      await createEliminacionVacuna(eliminacionVacunaData);

      window.location.reload();

      // Redirigir o hacer algo después de la eliminación exitosa
    } catch (error) {
      console.error('Error en reportar eliminación de vacunas:', error);
      setProcessing(false);

      // Manejar errores aquí, por ejemplo, mostrar un mensaje de error al usuario
    }
  });

  // Lógica del carrusel
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={onSubmit} className="bg-dark p-4 rounded">
          <div id={`carouselEliminar${stock.id + size}`} className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className={`carousel-item ${currentSlide === 0 ? 'active' : ''}`}>
                <h3>{stock.nombre_vacuna}</h3>
                <p>Responsable eliminación: {userDetails.name} {userDetails.last_name} {"(" + stock.nombre_vacunatorio + ")"}</p>
                <div className="mb-3">
                  <label htmlFor="cantidad" className="form-label text-light">
                    Cantidad eliminada:
                  </label>
                  <input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    {...register('cantidad_eliminada', {
                      required: true,
                      min: 1,
                      max: stock.stock || Infinity,
                    })}
                    className="form-control"
                  />
                  {errors.cantidad_eliminada && (
                    <p className="text-danger">
                      {errors.cantidad_eliminada.type === 'required' && 'Debe ingresar un número'}
                      {errors.cantidad_eliminada.type === 'min' && 'La cantidad debe ser mayor a 0'}
                      {errors.cantidad_eliminada.type === 'max' &&
                        'La cantidad no puede ser mayor al stock'}
                    </p>
                  )}
                </div>
                <div className='text-center'>
                  <button className="btn btn-danger me-2 fs-3 mt-2" type="button" onClick={nextSlide} disabled={!isValid}>Eliminar vacunas</button>
                </div>
              </div>
              <div className={`carousel-item ${currentSlide === 1 ? 'active' : ''}`}>
                <div className="text-center">
                  <h3>Resumen de la Eliminación</h3>
                  <p>Eliminarás {watch('cantidad_eliminada')} dosis {stock.nombre_vacuna}</p>
                </div>
                <div className="mb-3 text-center">
                  {processing ? (
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <div>
                      <button className="btn btn-primary me-2 fs-3 mt-2" type="button" onClick={prevSlide}>{"<"}</button>
                      <button type="submit" disabled={!isValid} className="btn btn-primary me-2 fs-3 mt-2">Confirmar eliminación</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
