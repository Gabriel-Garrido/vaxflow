import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Traspaso } from "./components/Traspaso";
import { Navigation } from "./components/Navigation";
import { Login } from "./pages/Login";
import { ChangePassword } from "./pages/ChangePassword";
import { Footer } from "./components/Footer"
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from "./AuthContext";
import { getUserDetails } from "./api/authentication";

function App() {
  const { isAuthenticated, user, setUserDetails } = useAuth();
  
  useEffect(() => {
    console.log('is authenticated?  ' + isAuthenticated +'  user: ' + user);
    if (isAuthenticated){
    getUserDetails()
        .then((userDetailsData) => {
          console.log('Detalles del usuario recibidos:', userDetailsData);
          setUserDetails(userDetailsData);
        })}

  }, [isAuthenticated])

  return (
    
    <BrowserRouter>
      <Navigation />     
      <div className="main-container" style={{ minHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
        <Routes>      
          {isAuthenticated ? (
            <>
              <Route path="/traspaso" element={<Traspaso />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Home />} />
              <Route path="/login" element={<Home />} />
            </>
          ) : (
            <Route path="*" element={<Login />} />
          )}
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
