import { Historial } from '../components/Historial'
import { Reportes } from '../components/Reportes'
import { Stock } from '../components/Stock'


export function Home() {
    
    return (
        <div className='container mt-2'>
        <div className='row'>
            <div className='col-lg-4 d-none d-xl-block'>
                <div className='container col-12'>
                    <Historial />
                </div>
            </div>
            <div className='col d-none d-xl-block'>
                <div className='col-12 col-md-10 offset-md-1'>
                    <Stock />
                </div>
            </div>
            <div className='col-lg-3 d-none d-xl-block'>
                <div className='container col-12'>
                    <Reportes />
                </div>
            </div>
        </div>
    
        {/* Small screen */}
        <nav className='d-flex mb-0 d-xl-none'>
            <div className="nav nav-tabs align-content-top col-12 d-xl-none text-center" id="nav-tab" role="tablist">
                <button className="nav-link active col-4" id="nav-historial-tab" data-bs-toggle="tab" data-bs-target="#nav-historial" type="button" role="tab" aria-controls="nav-historial" aria-selected="true"><i className="fa-solid fa-book fs-3"></i></button>
                <button className="nav-link col-4" id="nav-stock-tab" data-bs-toggle="tab" data-bs-target="#nav-stock" type="button" role="tab" aria-controls="nav-stock" aria-selected="false"><i className="fa-solid fa-syringe fs-3"></i></button>
                <button className="nav-link col-4" id="nav-reporte-tab" data-bs-toggle="tab" data-bs-target="#nav-reporte" type="button" role="tab" aria-controls="nav-reporte" aria-selected="false"><i className="fa-solid fa-pencil fs-3"></i></button>
            </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-historial" role="tabpanel" aria-labelledby="nav-historial-tab" tabindex="0">
                <Historial />
            </div>
            <div className="tab-pane fade" id="nav-stock" role="tabpanel" aria-labelledby="nav-stock-tab" tabIndex="0">
                <Stock />
            </div>
            <div className="tab-pane fade" id="nav-reporte" role="tabpanel" aria-labelledby="nav-reporte-tab" tabIndex="0">
                <Reportes />
            </div>
        </div>
        {/* //Small screen */}
    </div>
)}