import { Historial } from '../components/Historial'
import { Reportes } from '../components/Reportes'
import { Stock } from '../components/Stock'


export function Home() {
    
    return (
    <div className='container row mt-4'>
        <div className='col-lg-4 d-none d-lg-block'>
            <div className=' container col-12'>
                <Historial />
            </div>
        </div>
        <div className='col'>
            <div className='col-12 col-md-10 offset-md-1 '>
                <Stock />
            </div>
        </div>
        <div className='col-lg-2 d-none d-lg-block'>
            <div className=' container col-12'>
                <Reportes />
            </div>
        </div>
    </div>
)}