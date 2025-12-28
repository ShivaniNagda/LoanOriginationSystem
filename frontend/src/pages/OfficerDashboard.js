import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Loader from '../components/Loader';
import './css/Dashboard.css';

const OfficerDashboard = () => {
  const [pendingLoans, setPendingLoans] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchPendingLoans();
    fetchMyReviews();
  }, []);

  const fetchPendingLoans = async () => {
    try {
      const response = await api.get('/officer/loans/pending');
      setPendingLoans(response.data);
    } catch (error) {
      toast.error('Failed to fetch pending loans');
      console.error('Error fetching pending loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReviews = async () => {
    try {
      const response = await api.get('/officer/loans/my-reviews');
      setMyReviews(response.data);
    } catch (error) {
      console.error('Error fetching my reviews:', error);
    }
  };

  const handleReview = async (loanId, action) => {
    try {
      await api.post(`/officer/loans/${loanId}/review`, { action });
      toast.success(`Loan ${action === 'APPROVE' ? 'approved' : 'rejected'} successfully!`);
      fetchPendingLoans();
      fetchMyReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} loan`);
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
        <h1 className='text-3xl font-semibold text-center underline'>Loan Officer Dashboard</h1>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Loans ({pendingLoans.length})
          </button>
          <button
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            My Reviews ({myReviews.length})
          </button>
        </div>

        {/* Pending Loans Tab */}
        {activeTab === 'pending' && (
          <div className="card">
            <h2 className='text-2xl font-semibold'>*Pending Loan Applications*</h2>
            {pendingLoans.length === 0 ? (
              <p>No pending loan applications.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Amount Requested</th>
                    <th>Tenure (Months)</th>
                    <th>Status</th>
                    <th>Eligibility Score</th>
                    <th>Applied Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLoans.map((loan) => (
                    <tr key={loan._id}>
                      <td>{loan._id.substring(0, 8)}...</td>
                      <td>{loan.customerId?.userId?.name || 'N/A'}</td>
                      <td>{loan.customerId?.userId?.email || 'N/A'}</td>
                      <td>₹{loan.amountRequested?.toLocaleString()}</td>
                      <td>{loan.tenureMonths}</td>
                      <td>{getStatusBadge(loan.status)}</td>
                      <td>
                        {loan.eligibilityScore
                          ? (loan.eligibilityScore * 100).toFixed(2) + '%'
                          : 'N/A'}
                      </td>
                      <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-success"
                            onClick={() => handleReview(loan._id, 'APPROVE')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleReview(loan._id, 'REJECT')}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* My Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="card">
            <h2 className='text-2xl font-semibold'>My Reviews</h2>
            {myReviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Amount Requested</th>
                    <th>Tenure (Months)</th>
                    <th>Status</th>
                    <th>Eligibility Score</th>
                    <th>Interest Rate</th>
                    <th>Reviewed Date</th>
                  </tr>
                </thead>
                <tbody>
                  {myReviews.map((loan) => (
                    <tr key={loan._id}>
                      <td>{loan._id.substring(0, 8)}...</td>
                      <td>{loan.customerId?.userId?.name || 'N/A'}</td>
                      <td>{loan.customerId?.userId?.email || 'N/A'}</td>
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
                      <td>{new Date(loan.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;

