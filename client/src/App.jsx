import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Traspaso } from "./components/home/Traspaso";
import { Navigation } from "./components/static/Navigation";
import { Login } from "./pages/Login";
import { ChangePassword } from "./pages/ChangePassword";
import { Footer } from "./components/static/Footer"
import React, { useEffect, useState } from 'react';
import { useAuth } from "./AuthContext";


function App() {
  const { isAuthenticated, user, setUserDetails, fetchUserDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true)
    if (isAuthenticated){
      fetchUserDetails()
      setLoading(false)
      } else {
          setLoading(false)
        }
    setLoading(false)

  }, [isAuthenticated])

  if (loading) {
    return (
    <div>
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>)
  }else{

  return (
    
    <BrowserRouter>
    
      <Navigation />     
      <div className="main-container" style={{ minHeight: 'calc(100vh - 100px)', overflowY: 'auto', width: '100%' }}>
        <Routes>   
          <Route
            path="*"
            element={isAuthenticated ? <Home /> : <Login />}
          />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
}

export default App;
