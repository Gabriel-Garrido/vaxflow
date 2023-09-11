import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Traspaso } from './Traspaso';

export function StockCard({ stock, size }) {
  return (
    <div key={stock.id + size} className="card text-white">
      <div className="card-body text-start row">
        <div className='col-6'>
          {stock.fecha_descongelacion && stock.hora_descongelacion && (
            <p className="mb-0 custom-stock-card">
              <strong><i className="fa-solid fa-temperature-arrow-up"></i> Descongelación: </strong> <br /> {' '}
              {format(new Date(stock.fecha_descongelacion), 'dd MMM yyyy', { locale: es })}{' '}
              - {format(new Date(`1970-01-01T${stock.hora_descongelacion}`), 'hh:mm')}
            </p>
            
          )}
          <br />
          {stock.fecha_caducidad_descongelacion && (
            <p className="mb-0 custom-stock-card">
              <strong><i className="fa-solid fa-hourglass-half"></i> Caducidad por descong:</strong> <br /> {' '}
              {format(new Date(stock.fecha_caducidad_descongelacion), 'dd MMM yyyy', { locale: es })}{' '}
              - {format(new Date(`1970-01-01T${stock.hora_descongelacion}`), 'hh:mm')}
            </p>
          )}
          <hr />
          <p className="mb-0 custom-stock-card">
            <strong>Caducidad fabricante:</strong>{' '}
            {format(new Date(stock.caducidad_fabricante), 'eee dd MMM yyyy', { locale: es })}
          </p>
        </div>

        <div className="container col-6">
  <div className="row text-center">
    <div className="col-12 mb-2">
      <div className="btn-group d-flex" role="group">
        {/* Botón modal traspaso */}
        <button type="button" className="btn btn-primary flex-fill" data-bs-toggle="modal" data-bs-target={`#offcanvas${stock.id + size}`}>
          <div>
            <div><i className="fa-regular fa-paper-plane fs-4"></i></div>
            <div>Entregar vacunas</div>
          </div>
        </button>
      </div>
    </div>
    
  </div>
</div>



        {/* Modal */}
        <div className="modal fade" tabIndex="-1" id={`offcanvas${stock.id + size}`} aria-labelledby={`offcanvas${stock.id + size}Label`} aria-hidden="true">
          <div className="modal-dialog modal-dialog-start">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`offcanvas${stock.id + size}Label`}>Offcanvas</h5>
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