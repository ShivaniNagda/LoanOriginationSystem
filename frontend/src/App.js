import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import PageNotFound from './pages/PageNotFound';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  return (
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
             <Route path="/login" element={<Login />} />
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/dashboard"
              element={
                <ProtectedRoute requiredRole="OFFICER">
                  <OfficerDashboard />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
          <Route path='*' element={<PageNotFound />} />

          </Routes>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
    
  );
}

export default App;

