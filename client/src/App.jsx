import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Traspaso } from "./components/Traspaso";
import { Navigation } from "./components/Navigation";
import { Login } from "./pages/Login";
import { ChangePassword } from "./pages/ChangePassword";
import { Footer } from "./components/Footer"
import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from "./AuthContext";
import { getUserDetails, logout } from "./api/authentication";

function App() {
  const { isAuthenticated, user, setUserDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true)

    console.log('is authenticated?  ' + isAuthenticated +'  user: ' + user);
    if (isAuthenticated){
    getUserDetails()
        .then((userDetailsData) => {
          console.log('-----------UserDetails---------:', userDetailsData);
          setUserDetails(userDetailsData);
          setLoading(false)

        })} else {
          setLoading(false)


        }
    setLoading(false)

  }, [])

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
}

export default App;
