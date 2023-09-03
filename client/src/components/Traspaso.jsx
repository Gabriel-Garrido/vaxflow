import React, { useState, useEffect } from 'react';
import { getAllStock, getAllVacunatorios, createTraspaso } from '../api/inventario';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { logout } from '../api/authentication';

export function Traspaso() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    mode: 'all', // Habilitar validación en cada cambio
    defaultValues: {
      cantidad_traspasada: 1, // Valor predeterminado para cantidad
    },
  });
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [vacunatorios, setVacunatorios] = useState([]);
  const { isAuthenticated, setIsAuthenticated } = useAuth()

  useEffect(() => {
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

  const onSubmit = handleSubmit(async data => {
    if (isAuthenticated) { // Verifica autenticación antes de realizar la acción
      await createTraspaso(data);
      navigate('/home');
    } else {
      console.error('User is not authenticated');
      // Puedes manejar el feedback al usuario
      navigate("/login")
    }
  });

  return (
    <div>
  <form onSubmit={onSubmit} className="bg-dark p-4 rounded">
    <div className="mb-3">
      <label htmlFor="vacuna" className="form-label text-light">
        Selecciona una vacuna:
      </label>
      <select
        id="vacuna"
        name="vacuna"
        {...register('vacuna_traspaso', { required: true })}
        className="form-select"
      >
        <option value=""></option>
        {stocks.map((stock) => (
          <option key={stock.id} value={stock.id}>
            {stock.nombre_vacunatorio} {'=>'} {stock.nombre_vacuna} - Stock: {stock.stock}
          </option>
        ))}
      </select>
      {errors.vacuna_traspaso && <p className="text-danger">Este campo es requerido</p>}
    </div>
    <div className="mb-3">
      <label htmlFor="vacunatorio" className="form-label text-light">
        Selecciona un vacunatorio:
      </label>
      <select
        id="vacunatorio"
        name="vacunatorio"
        {...register('vacunatorio_destino', { required: true })}
        className="form-select"
      >
        <option value=""></option>
        {vacunatorios.map((vacunatorio) => (
          <option key={vacunatorio.id} value={vacunatorio.id}>
            {vacunatorio.nombre}
          </option>
        ))}
      </select>
      {errors.vacunatorio_destino && <p className="text-danger">Este campo es requerido</p>}
    </div>
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

    <div className="mb-3">
      <label htmlFor="responsable_entrega" className="form-label text-light">
        Responsable de entrega:
      </label>
      <input
        type="text"
        id="responsable_entrega"
        name="responsable_entrega"
        {...register('responsable_entrega', { required: true })}
        className="form-control"
      />
      {errors.responsable_entrega && <p className="text-danger">Este campo es requerido</p>}
    </div>
    <div className="mb-3">
      <label htmlFor="responsable_recepcion" className="form-label text-light">
        Responsable de recepción:
      </label>
      <input
        type="text"
        id="responsable_recepcion"
        name="responsable_recepcion"
        {...register('responsable_recepcion', { required: true })}
        className="form-control"
      />
      {errors.responsable_recepcion && <p className="text-danger">Este campo es requerido</p>}
    </div>
    <div className="mb-3 text-center">
      <button type="submit" disabled={!isValid} className="btn btn-primary me-2 fs-3 mt-2">
        Realizar traspaso
      </button>
    </div>
  </form>
</div>


  );
}