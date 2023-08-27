import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Traspaso } from "./pages/Traspaso";
import { Navigation } from "./components/Navigation";
import { Login } from "./pages/Login";
import { ChangePassword } from "./pages/ChangePassword";
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from "./AuthContext";

function App() {

  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    console.log('is authenticated?  ' + isAuthenticated +'  user: ' + user);
  }, [isAuthenticated])

  return (
    <BrowserRouter>
      <Navigation />     
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
    </BrowserRouter>
  );
}

export default App;