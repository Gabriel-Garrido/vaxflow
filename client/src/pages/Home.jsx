import { Historial } from '../components/Historial'
import { Reportes } from '../components/Reportes'
import { Stock } from '../components/Stock'


export function Home() {
    
    return (
    <div className='container row mt-4'>
        <div className='col-lg-4 d-none d-xl-block'>
            <div className=' container col-12'>
                <Historial />
            </div>
        </div>
        <div className='col d-none d-xl-block '>
            <div className='col-12 col-md-10 offset-md-1 '>
                <Stock />
            </div>
        </div>
        <div className='col-lg-2 d-none d-xl-block'>
            <div className=' container col-12'>
                <Reportes />
            </div>
        </div>

        {/* Small screen */}
        <nav>
            <div class="nav nav-tabs col-12 d-xl-none text-center row" id="nav-tab" role="tablist">
                <button class="nav-link active col-4" id="nav-historial-tab" data-bs-toggle="tab" data-bs-target="#nav-historial" type="button" role="tab" aria-controls="nav-historial" aria-selected="true"><i class="fa-solid fa-book fs-3"></i></button>
                <button class="nav-link col-4" id="nav-stock-tab" data-bs-toggle="tab" data-bs-target="#nav-stock" type="button" role="tab" aria-controls="nav-stock" aria-selected="false"><i class="fa-solid fa-syringe fs-3"></i></button>
                <button class="nav-link col-4" id="nav-reporte-tab" data-bs-toggle="tab" data-bs-target="#nav-reporte" type="button" role="tab" aria-controls="nav-reporte" aria-selected="false"><i class="fa-solid fa-pencil fs-3"></i></button>
            </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-historial" role="tabpanel" aria-labelledby="nav-historial-tab" tabindex="0">
                <Historial />
            </div>
            <div class="tab-pane fade" id="nav-stock" role="tabpanel" aria-labelledby="nav-stock-tab" tabindex="0">
                <Stock />
            </div>
            <div class="tab-pane fade" id="nav-reporte" role="tabpanel" aria-labelledby="nav-reporte-tab" tabindex="0">
                <Reportes />
            </div>
        </div>

        {/* //Small screen */}

    </div>
)}