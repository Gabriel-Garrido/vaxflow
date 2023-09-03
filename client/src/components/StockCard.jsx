import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function StockCard({ stock }) {
  return (
    <div key={stock.id} className="card text-bg-light mb-3">
      <div className="card-text text-light text-start">
        {stock.fecha_descongelacion && stock.hora_descongelacion && (
          <p className="mb-0">
            <strong>Descongeladas el:</strong>{' '}
            {format(new Date(stock.fecha_descongelacion), 'eee dd MMM yyyy', { locale: es })}{' '}
            a las {format(new Date(`1970-01-01T${stock.hora_descongelacion}`), 'hh:mm')}
          </p>
        )}
        {stock.fecha_caducidad_descongelacion && (
          <p className="mb-0">
            <strong>Caduca el:</strong>{' '}
            {format(new Date(stock.fecha_caducidad_descongelacion), 'eee dd MMM yyyy', { locale: es })}
          </p>
        )}
        <p className="mb-0">
          <strong>Caducidad fabricante:</strong>{' '}
          {format(new Date(stock.caducidad_fabricante), 'eee dd MMM yyyy', { locale: es })}
        </p>
        <p className="mb-0">
          <strong>Vacunatorio:</strong> {stock.nombre_vacunatorio}
        </p>
      </div>
    </div>
  );
}