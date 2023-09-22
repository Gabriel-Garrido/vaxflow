import { useAuth } from '../AuthContext';
import { Historial } from '../components/home/Historial'
import { Reportes } from '../components/home/Reportes'
import { Stock } from '../components/home/Stock'

export function Home() {
    const { userDetails } = useAuth();


    if (!userDetails) {
        return (
          <div>
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        );
      } else {
    return (
        <div className=' mt-2'>
        <div className='row container'>
            <div className='col-lg-4 d-none d-xl-block'>
                <div className='container col-12'>
                    <Historial userDetails={userDetails} />
                </div>
            </div>
            <div className='col-lg-5 d-none d-xl-block'>
                <div className='col-12 col-md-10 offset-md-1'>
                    <Stock userDetails={userDetails} size="lg"/>
                </div>
            </div>
            <div className='col-lg-3 d-none d-xl-block'>
                <div className='container col-12'>
                    <Reportes userDetails={userDetails} />
                </div>
            </div>
        </div>
    
        {/* Small screen */}
        <div className='container row'>
        <nav className='d-block mb-0 d-xl-none '>
            <div className="nav nav-tabs align-content-top col-12 d-xl-none text-center" id="nav-tab" role="tablist">
                <button className="nav-link col-4" id="nav-historial-tab" data-bs-toggle="tab" data-bs-target="#nav-historial" type="button" role="tab" aria-controls="nav-historial" aria-selected="true"><i className="fa-solid fa-book fs-3"></i></button>
                <button className="nav-link active col-4" id="nav-stock-tab" data-bs-toggle="tab" data-bs-target="#nav-stock" type="button" role="tab" aria-controls="nav-stock" aria-selected="false"><i className="fa-solid fa-syringe fs-3"></i></button>
                <button className="nav-link col-4" id="nav-reporte-tab" data-bs-toggle="tab" data-bs-target="#nav-reporte" type="button" role="tab" aria-controls="nav-reporte" aria-selected="false"><i className="fa-solid fa-pencil fs-3"></i></button>
            </div>
        </nav>
        <div className="tab-content d-xl-none" id="nav-tabContent">
            <div className="tab-pane fade" id="nav-historial" role="tabpanel" aria-labelledby="nav-historial-tab" tabIndex="0">
                <Historial userDetails={userDetails} />
            </div>
            <div className="tab-pane fade show active" id="nav-stock" role="tabpanel" aria-labelledby="nav-stock-tab" tabIndex="0">
                <Stock userDetails={userDetails} size="sm"/>
            </div>
            <div className="tab-pane fade" id="nav-reporte" role="tabpanel" aria-labelledby="nav-reporte-tab" tabIndex="0">
                <Reportes userDetails={userDetails} />
            </div>
        </div>
        </div>
        {/* //Small screen */}
    </div>
)}}