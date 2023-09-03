import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Traspaso } from './Traspaso';

export function StockCard({ stock }) {
  return (
    <div key={stock.id} className="card text-white mb-3">
      <div className="card-body text-start row">
        <div className='col-6'>
          {stock.fecha_descongelacion && stock.hora_descongelacion && (
            <p className="mb-0">
              <strong>Descongeladas el:</strong> <br /> {' '}
              {format(new Date(stock.fecha_descongelacion), 'dd MMM yyyy', { locale: es })}{' '}
              - {format(new Date(`1970-01-01T${stock.hora_descongelacion}`), 'hh:mm')}
            </p>
            
          )}
          <br />
          {stock.fecha_caducidad_descongelacion && (
            <p className="mb-0">
              <strong>Caduca el:</strong> <br /> {' '}
              {format(new Date(stock.fecha_caducidad_descongelacion), 'dd MMM yyyy', { locale: es })}{' '}
              - {format(new Date(`1970-01-01T${stock.hora_descongelacion}`), 'hh:mm')}
            </p>
          )}
          <hr />
          <p className="mb-0">
            <strong>Caducidad fabricante:</strong>{' '}
            {format(new Date(stock.caducidad_fabricante), 'eee dd MMM yyyy', { locale: es })}
          </p>
        </div>

        <div className="container col-6">
  <div className="row text-center">
    <div className="col-12 mb-2">
      <div className="btn-group d-flex" role="group">
        {/* Botón modal traspaso */}
        <button type="button" className="btn btn-primary flex-fill" data-bs-toggle="modal" data-bs-target={`#offcanvas${stock.id}`}>
          Traspaso
        </button>
      </div>
    </div>
    <div className="col-12 mb-2">
      <div className="btn-group d-flex" role="group">
        {/* Botón modal registro de administradas */}
        <button type="button" className="btn btn-primary flex-fill" data-bs-toggle="modal" data-bs-target={`#offcanvas${stock.id}`}>
          Registrar administradas del día
        </button>
      </div>
    </div>
    <div className="col-12 mt-4">
      <div className="btn-group d-flex" role="group">
        {/* Botón modal eliminación */}
        <button type="button" className="btn btn-danger flex-fill" data-bs-toggle="modal" data-bs-target={`#offcanvas${stock.id}`}>
          Eliminar
        </button>
      </div>
    </div>
    
  </div>
</div>



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