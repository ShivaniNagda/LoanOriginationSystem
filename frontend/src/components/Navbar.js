import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './css/Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
console.log("user.role",user?.role);
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar  ">
      <div className="navbar-container">
      <div className="logo d-flex flex-col center-align">
          <img src={logo} alt="OneClickLoan Logo" className='w-1/4 h-1/4 rounded-full' />
  
         <Link to="/" className="navbar-brand">
           OneClickLoan
        </Link>

        </div>
       
        <div className="navbar-menu">
          {user ? (
            <>
              {user.role === 'CUSTOMER' && (
                <Link to="/customer/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              )}
              {user.role === 'OFFICER' && (
                <Link to="/officer/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              )}
              <span className="navbar-user">Welcome, {user.role}</span>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link text-xl border-sky-400 bg-sky-600">
                Login
              </Link>
              <Link to="/register" className="navbar-link text-xl bg-slate-50 text-sky-900 hover:text-stone-50">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

