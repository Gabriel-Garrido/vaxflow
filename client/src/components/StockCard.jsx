import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function StockCard({ stock }) {
  return (
    <div key={stock.id}>
      {stock.fecha_descongelacion && stock.hora_descongelacion && (
        <p>
          Descongeladas el{' '}
          {format(new Date(stock.fecha_descongelacion), 'eee dd MMM yyyy', { locale: es })}{' '}
          a las {format(new Date(`1970-01-01T${stock.hora_descongelacion}`), 'hh:mm')}
        </p>
      )}
      {stock.fecha_caducidad_descongelacion && (
        <p>
          Caduca el{' '}
          {format(new Date(stock.fecha_caducidad_descongelacion), 'eee dd MMM yyyy', { locale: es })}
        </p>
      )}
      <p>Vacunatorio: {stock.nombre_vacunatorio}</p>
      <p>
        Fecha caducidad fabricante:{' '}
        {format(new Date(stock.caducidad_fabricante), 'eee dd MMM yyyy', { locale: es })}
      </p>
      <p>Stock: {stock.stock}</p>
      <hr />
    </div>
  );
}