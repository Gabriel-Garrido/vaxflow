import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Traspaso } from './Traspaso';

export function StockCard({ stock }) {
  return (
    <div key={stock.id} className="card text-white mb-3">
      <div className="card-body text-start">
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

        {/* Botón modal */}
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#offcanvas${stock.id}`}>
          Link with href
        </button>

        {/* Modal */}
        <div className="modal fade" tabIndex="-1" id={`offcanvas${stock.id}`} aria-labelledby={`offcanvas${stock.id}Label`} aria-hidden="true">
          <div className="modal-dialog modal-dialog-start">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`offcanvas${stock.id}Label`}>Offcanvas</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body text-center">
                <div className="text-start">
                  <Traspaso stock={stock} />
                </div>
                <button type="button" className="btn btn-secondary mt-3 fs-3" data-bs-dismiss="modal" aria-label="Close">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}