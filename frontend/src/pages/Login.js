import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
console.log('Login result:', result);
    if (result.success) {
      toast.success('Login successful!');
      // Navigate based on role
      const token = localStorage.getItem('token');
      console.log('Login token:', token, localStorage.getItem('token'));
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.role === 'CUSTOMER') {
            navigate('/customer/dashboard');
          } else if (payload.role === 'OFFICER') {
            navigate('/officer/dashboard');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          navigate('/login');
        }
      }
    } else {
      toast.error(result.message || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="login-container mt-10">
      <div className="login-card">
        <h2 className='center text-4xl text-sky-900 font-extrabold'>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group ">
            <label className='text-xl font-semibold'>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label className='text-xl font-semibold'>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="login-footer">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

