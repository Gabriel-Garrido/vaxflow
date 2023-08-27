import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Home } from "./pages/Home"
import { Traspaso } from "./pages/Traspaso"
import { Navigation } from "./components/Navigation"
import { Login } from "./pages/Login"
import { ChangePassword } from "./pages/ChangePassword"
import React, { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('accessToken') !== null
  );

  return (
    <BrowserRouter>
      <Navigation
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />     
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/traspaso" element={<Traspaso />} />
        
        {/* Definir rutas basadas en el estado de autenticación */}
        {isAuthenticated ? (
          <>
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : (
          <Route path="*" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App