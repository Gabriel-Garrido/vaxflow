import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './AuthContext'; 
import 'bootstrap/dist/css/bootstrap.css';
import { StockProvider } from './StockContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <div className='my-body'>
  <React.StrictMode>
    <AuthProvider>
      <StockProvider>
        <App />
      </StockProvider>
    </AuthProvider>
  </React.StrictMode>,
  </div>
)
