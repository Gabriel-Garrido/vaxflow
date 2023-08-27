import React, { useState, useEffect } from 'react';
import { getAllStock } from '../api/inventario';

export function Stock() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStock() {
      try {
        const response = await getAllStock(); // Utiliza la función getAllStock de tu API
        console.log(response.data);
        setStock(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock:', error);
        setLoading(false);
      }
    }

    fetchStock();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Stock</h2>
      <ul>
        {stock.map(item => (
          <li key={item.id}>
            {item.nombre_vacuna} - Cantidad: {item.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}
