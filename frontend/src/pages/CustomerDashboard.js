import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Loader from '../components/Loader';
import './css/Dashboard.css';

const CustomerDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [formData, setFormData] = useState({
    amountRequested: '',
    tenureMonths: ''
  });
  const [profileData, setProfileData] = useState({
    income: '',
    creditScore: ''
  });

  useEffect(() => {
    fetchLoans();
    fetchProfile();
  }, []);

  const fetchLoans = async () => {
     console.log('Fetching loans...');
    try {
     
      const response = await api.get('/loans/customer/my-loans');
      console.log('Loans fetched:', response.data);
      setLoans(response.data);
    } catch (error) {
      toast.error('Failed to fetch loans');
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/customer/profile');
      setProfile(response.data);
      setProfileData({
        income: response.data.income || '',
        creditScore: response.data.creditScore || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    try {
      await api.post('/loans/apply', {
        amountRequested: parseFloat(formData.amountRequested),
        tenureMonths: parseInt(formData.tenureMonths)
      });
      toast.success('Loan application submitted successfully!');
      setShowApplyForm(false);
      setFormData({ amountRequested: '', tenureMonths: '' });
      fetchLoans();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit loan application');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/customer/profile', {
        income: parseFloat(profileData.income) || undefined,
        creditScore: parseFloat(profileData.creditScore) || undefined
      });
      toast.success('Profile updated successfully!');
      setShowProfileForm(false);
      fetchProfile();
      fetchLoans(); // Refresh loans to get updated eligibility scores
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = status.toLowerCase();
    return <span className={`status-badge status-${statusClass}`}>{status}</span>;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container min-h-lvh">
      <div className="container">
        <h1 className='text-center text-4xl font-bold '>Customer Dashboard</h1>

        {/* Profile Section */}
        <div className="card">
          <div className="card-header">
            <h2 className='text-2xl font-semibold underline '>Profile</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowProfileForm(!showProfileForm)}
            >
              {showProfileForm ? 'Cancel' : 'Update Profile'}
            </button>
          </div>
          {profile && (
            <div className="profile-info">
              <p><strong>Name:</strong> {profile.userId?.name}</p>
              <p><strong>Email:</strong> {profile.userId?.email}</p>
              <p><strong>Income:</strong> {profile.income ? `₹${profile.income.toLocaleString()}` : 'Not set'}</p>
              <p><strong>Credit Score:</strong> {profile.creditScore || 'Not set'}</p>
            </div>
          )}
          {showProfileForm && (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label>Income (₹)</label>
                <input
                  type="number"
                  value={profileData.income}
                  onChange={(e) => setProfileData({ ...profileData, income: e.target.value })}
                  placeholder="Enter your annual income"
                />
              </div>
              <div className="form-group">
                <label>Credit Score</label>
                <input
                  type="number"
                  value={profileData.creditScore}
                  onChange={(e) => setProfileData({ ...profileData, creditScore: e.target.value })}
                  placeholder="Enter your credit score (300-850)"
                  min="300"
                  max="850"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Update Profile
              </button>
            </form>
          )}
        </div>

        {/* Apply for Loan Section */}
        <div className="card">
          <div className="card-header">
            <h2 className='text-2xl font-semibold'>Apply for Loan</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowApplyForm(!showApplyForm)}
            >
              {showApplyForm ? 'Cancel' : 'Apply for Loan'}
            </button>
          </div>
          {showApplyForm && (
            <form onSubmit={handleApplyLoan}>
              <div className="form-group">
                <label>Amount Requested (₹)</label>
                <input
                  type="number"
                  value={formData.amountRequested}
                  onChange={(e) => setFormData({ ...formData, amountRequested: e.target.value })}
                  required
                  placeholder="Enter loan amount"
                  min="1000"
                />
              </div>
              <div className="form-group">
                <label>Tenure (Months)</label>
                <input
                  type="number"
                  value={formData.tenureMonths}
                  onChange={(e) => setFormData({ ...formData, tenureMonths: e.target.value })}
                  required
                  placeholder="Enter loan tenure in months"
                  min="1"
                  max="120"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit Application
              </button>
            </form>
          )}
        </div>

        {/* Loan Applications */}
        <div className="card">
          <h2 className='text-2xl font-semibold'>My Loan Applications</h2>
          {loans.length === 0 ? (
            <p>No loan applications yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Amount Requested</th>
                  <th>Tenure (Months)</th>
                  <th>Status</th>
                  <th>Eligibility Score</th>
                  <th>Interest Rate</th>
                  <th>Applied Date</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan._id}>
                    <td>{loan._id.substring(0, 8)}...</td>
                    <td>₹{loan.amountRequested?.toLocaleString()}</td>
                    <td>{loan.tenureMonths}</td>
                    <td>{getStatusBadge(loan.status)}</td>
                    <td>
                      {loan.eligibilityScore
                        ? (loan.eligibilityScore * 100).toFixed(2) + '%'
                        : 'N/A'}
                    </td>
                    <td>
                      {loan.interestRate ? loan.interestRate.toFixed(2) + '%' : 'N/A'}
                    </td>
                    <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

