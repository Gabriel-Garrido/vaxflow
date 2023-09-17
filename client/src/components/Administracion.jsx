import React, { useState } from 'react';
import { createAdministracionVacuna } from '../api/inventario';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export function Administracion({ stock, size }) {
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, userDetails } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    mode: 'all',
    defaultValues: {
      vacuna_traspaso: stock.id,
      cantidad_administrada: 1,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setProcessing(true);

      const administracionVacunaData = {
        vacuna: data.vacuna_traspaso,
        cantidad_administrada: parseInt(data.cantidad_administrada),
        responsable_administracion: userDetails.id,
        vacunatorio_administracion: userDetails.vacunatorio,
      };

      await createAdministracionVacuna(administracionVacunaData);

      window.location.reload();
      setProcessing(false);

      // Redirigir o hacer algo después de la administracion exitosa
    } catch (error) {
      console.error('Error en reportar administracion de vacunas:', error);
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
          <div id={`carouselAdministrar${stock.id + size}`} className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className={`carousel-item ${currentSlide === 0 ? 'active' : ''}`}>
                <h3>{stock.nombre_vacuna}</h3>
                <p>Responsable administracion: {userDetails.name} {userDetails.last_name} {"(" + stock.nombre_vacunatorio + ")"}</p>
                <div className="mb-3">
                  <label htmlFor="cantidad" className="form-label text-light">
                    Cantidad administrada:
                  </label>
                  <input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    {...register('cantidad_administrada', {
                      required: true,
                      min: 1,
                      max: stock.stock || Infinity,
                    })}
                    className="form-control"
                  />
                  {errors.cantidad_administrada && (
                    <p className="text-danger">
                      {errors.cantidad_administrada.type === 'required' && 'Debe ingresar un número'}
                      {errors.cantidad_administrada.type === 'min' && 'La cantidad debe ser mayor a 0'}
                      {errors.cantidad_administrada.type === 'max' &&
                        'La cantidad no puede ser mayor al stock'}
                    </p>
                  )}
                </div>
                <div className='text-center'>
                  <button className="btn btn-danger me-2 fs-3 mt-2" type="button" onClick={nextSlide} disabled={!isValid}>Administrar vacunas</button>
                </div>
              </div>
              <div className={`carousel-item ${currentSlide === 1 ? 'active' : ''}`}>
                <div className="text-center">
                  <h3>Resumen de la administracion</h3>
                  <p>Administrarás {watch('cantidad_administrada')} dosis {stock.nombre_vacuna}</p>
                </div>
                <div className="mb-3 text-center">
                  {processing ? (
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <div>
                      <button className="btn btn-primary me-2 fs-3 mt-2" type="button" onClick={prevSlide}>{"<"}</button>
                      <button type="submit" disabled={!isValid} className="btn btn-primary me-2 fs-3 mt-2">Confirmar administracion</button>
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
