import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [token, setToken] = useState(localStorage.getItem('token'));
  console.log('AuthProvider user:', user);
  console.log('AuthProvider loading:', localStorage.getItem('token'));
console.log('AuthProvider initial token:', token);
  useEffect(() => {
    console.log('AuthProvider token:', token);
    if (token) {
      localStorage.setItem('token', token);
      // Decode token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          userId: payload.userId,
          role: payload.role
        });
        console.log('Decoded user from token:', {
          userId: payload.userId,
          role: payload.role
        });
        
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        setToken(null);
      }
    } else {
      console.log('No token found, setting user to null');
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password
      });
      console.log('Login response data:', response.data);
      const { token: newToken, userId, role } = response.data;
      setToken(newToken);
      setUser({ userId, role });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      await axios.post('http://localhost:5000/auth/register', {
        name,
        email,
        password,
        role
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

