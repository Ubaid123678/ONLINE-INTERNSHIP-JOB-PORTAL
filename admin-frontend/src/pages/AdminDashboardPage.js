import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [metrics, setMetrics] = useState({
    students: 0,
    clients: 0,
    totalJobs: 0,
    totalApplications: 0
  });
  
  const navigate = useNavigate();

  const students = users.filter(u => u.role === 'student');
  const clients = users.filter(u => u.role === 'client');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersRes, jobsRes, withdrawalsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/jobs'),
        api.get('/admin/withdrawals?status=pending')
      ]);

      setUsers(usersRes.data.users || []);
      setJobs(jobsRes.data.jobs || []);
      setWithdrawals(withdrawalsRes.data.withdrawals || []);
      
      setMetrics({
        students: usersRes.data.users.filter(u => u.role === 'student').length,
        clients: usersRes.data.users.filter(u => u.role === 'client').length,
        totalJobs: jobsRes.data.jobs.length,
        totalApplications: jobsRes.data.totalApplications || 0
      });
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await api.delete(`/admin/jobs/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch (err) {
      alert('Failed to delete job: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleApproveWithdrawal = async (withdrawalId) => {
    if (!window.confirm('Approve this withdrawal request?')) return;
    
    try {
      await api.post(`/admin/withdrawals/${withdrawalId}/approve`);
      setWithdrawals(withdrawals.filter(w => w._id !== withdrawalId));
      alert('Withdrawal approved successfully');
    } catch (err) {
      alert('Failed to approve withdrawal: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectWithdrawal = async (withdrawalId) => {
    if (!window.confirm('Reject this withdrawal request? Funds will be returned to user.')) return;
    
    try {
      await api.post(`/admin/withdrawals/${withdrawalId}/reject`);
      setWithdrawals(withdrawals.filter(w => w._id !== withdrawalId));
      alert('Withdrawal rejected and funds returned to user');
    } catch (err) {
      alert('Failed to reject withdrawal: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_portal_token');
    localStorage.removeItem('admin_portal_user');
    navigate('/admin/login');
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Admin Dashboard';
      case 'students': return 'Student Management';
      case 'clients': return 'Client Management';
      case 'jobs': return 'Job Management';
      case 'withdrawals': return 'Withdrawal Requests';
      default: return 'Admin Dashboard';
    }
  };

  const getSectionSubtitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Overview of platform statistics';
      case 'students': return 'Manage student accounts';
      case 'clients': return 'Manage client/recruiter accounts';
      case 'jobs': return 'Manage job postings';
      case 'withdrawals': return 'Review and process withdrawal requests';
      default: return '';
    }
  };

  return (
    <>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex'
      }}>
        {/* Modern Sidebar */}
        <aside style={{
          width: '280px',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto'
        }}>
          {/* Logo/Brand */}
          <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.5rem', 
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              <i className="bi bi-shield-check me-2"></i>
              Admin Panel
            </h2>
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveSection('dashboard')}
                style={{
                  padding: '1rem 1.25rem',
                  border: 'none',
                  background: activeSection === 'dashboard' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'transparent',
                  color: activeSection === 'dashboard' ? '#fff' : '#495057',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== 'dashboard') {
                    e.currentTarget.style.background = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== 'dashboard') {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <i className="bi bi-speedometer2" style={{ fontSize: '1.25rem' }}></i>
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveSection('students')}
                style={{
                  padding: '1rem 1.25rem',
                  border: 'none',
                  background: activeSection === 'students' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'transparent',
                  color: activeSection === 'students' ? '#fff' : '#495057',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== 'students') {
                    e.currentTarget.style.background = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== 'students') {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <i className="bi bi-mortarboard" style={{ fontSize: '1.25rem' }}></i>
                  <span>Students</span>
                </div>
                {students.length > 0 && (
                  <span style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    background: activeSection === 'students' ? 'rgba(255,255,255,0.3)' : '#e7f3ff',
                    color: activeSection === 'students' ? '#fff' : '#0d6efd'
                  }}>
                    {students.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveSection('clients')}
                style={{
                  padding: '1rem 1.25rem',
                  border: 'none',
                  background: activeSection === 'clients' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'transparent',
                  color: activeSection === 'clients' ? '#fff' : '#495057',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== 'clients') {
                    e.currentTarget.style.background = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== 'clients') {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <i className="bi bi-building" style={{ fontSize: '1.25rem' }}></i>
                  <span>Clients</span>
                </div>
                {clients.length > 0 && (
                  <span style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    background: activeSection === 'clients' ? 'rgba(255,255,255,0.3)' : '#ffe7f3',
                    color: activeSection === 'clients' ? '#fff' : '#d63384'
                  }}>
                    {clients.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveSection('jobs')}
                style={{
                  padding: '1rem 1.25rem',
                  border: 'none',
                  background: activeSection === 'jobs' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'transparent',
                  color: activeSection === 'jobs' ? '#fff' : '#495057',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== 'jobs') {
                    e.currentTarget.style.background = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== 'jobs') {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <i className="bi bi-briefcase" style={{ fontSize: '1.25rem' }}></i>
                  <span>Jobs</span>
                </div>
                {jobs.length > 0 && (
                  <span style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    background: activeSection === 'jobs' ? 'rgba(255,255,255,0.3)' : '#e7f3ff',
                    color: activeSection === 'jobs' ? '#fff' : '#0d6efd'
                  }}>
                    {jobs.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveSection('withdrawals')}
                style={{
                  padding: '1rem 1.25rem',
                  border: 'none',
                  background: activeSection === 'withdrawals' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'transparent',
                  color: activeSection === 'withdrawals' ? '#fff' : '#495057',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== 'withdrawals') {
                    e.currentTarget.style.background = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== 'withdrawals') {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <i className="bi bi-cash-stack" style={{ fontSize: '1.25rem' }}></i>
                  <span>Withdrawals</span>
                </div>
                {withdrawals.length > 0 && (
                  <span style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    background: '#dc3545',
                    color: '#fff'
                  }}>
                    {withdrawals.length}
                  </span>
                )}
              </button>
            </div>
          </nav>

          {/* Logout Button */}
          <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #dc3545',
                background: 'transparent',
                color: '#dc3545',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dc3545';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#dc3545';
              }}
            >
              <i className="bi bi-box-arrow-right"></i>
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', maxHeight: '100vh' }}>
          {/* Page Header */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '1.5rem 2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#212529' }}>
                {getSectionTitle()}
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', color: '#6c757d' }}>
                {getSectionSubtitle()}
              </p>
            </div>
            {activeSection !== 'dashboard' && (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    width: '300px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e9ecef';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <i className="bi bi-search" style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d',
                  fontSize: '1.1rem'
                }}></i>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div style={{
              background: '#f8d7da',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#721c24',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <i className="bi bi-exclamation-triangle-fill"></i>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Dashboard Section */}
              {activeSection === 'dashboard' && (
                <>
                  {/* Metric Cards */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '1.5rem',
                    marginBottom: '2rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '16px',
                      padding: '1.75rem',
                      color: '#fff',
                      boxShadow: '0 8px 24px rgba(102,126,234,0.3)',
                      transition: 'transform 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Students</p>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem', fontWeight: '700' }}>
                            {metrics.students}
                          </p>
                        </div>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <i className="bi bi-mortarboard-fill" style={{ fontSize: '1.75rem' }}></i>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      borderRadius: '16px',
                      padding: '1.75rem',
                      color: '#fff',
                      boxShadow: '0 8px 24px rgba(245,87,108,0.3)',
                      transition: 'transform 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Clients</p>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem', fontWeight: '700' }}>
                            {metrics.clients}
                          </p>
                        </div>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <i className="bi bi-building" style={{ fontSize: '1.75rem' }}></i>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      borderRadius: '16px',
                      padding: '1.75rem',
                      color: '#fff',
                      boxShadow: '0 8px 24px rgba(0,242,254,0.3)',
                      transition: 'transform 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Active Jobs</p>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem', fontWeight: '700' }}>
                            {metrics.totalJobs}
                          </p>
                        </div>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <i className="bi bi-briefcase-fill" style={{ fontSize: '1.75rem' }}></i>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      borderRadius: '16px',
                      padding: '1.75rem',
                      color: '#fff',
                      boxShadow: '0 8px 24px rgba(56,249,215,0.3)',
                      transition: 'transform 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Applications</p>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem', fontWeight: '700' }}>
                            {metrics.totalApplications}
                          </p>
                        </div>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <i className="bi bi-file-earmark-text-fill" style={{ fontSize: '1.75rem' }}></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#212529' }}>
                      Quick Stats
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6c757d' }}>Total Users</p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: '700', color: '#212529' }}>
                          {students.length + clients.length}
                        </p>
                      </div>
                      <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #764ba2' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6c757d' }}>Students</p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: '700', color: '#212529' }}>
                          {students.length}
                        </p>
                      </div>
                      <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #f5576c' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6c757d' }}>Clients</p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: '700', color: '#212529' }}>
                          {clients.length}
                        </p>
                      </div>
                      <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #38f9d7' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6c757d' }}>Pending Withdrawals</p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: '700', color: '#212529' }}>
                          {withdrawals.length}
                        </p>
                      </div>
                      <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #00f2fe' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6c757d' }}>Active Jobs</p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: '700', color: '#212529' }}>
                          {jobs.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Students Section */}
              {activeSection === 'students' && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '2rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {students
                      .filter(user => 
                        !searchTerm || 
                        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(user => (
                      <div key={user._id} style={{
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        transition: 'all 0.3s ease',
                        border: '2px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#667eea';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(102,126,234,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      >
                        <div style={{ flex: 1 }}>
                          <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#212529' }}>
                            {user.name}
                          </h5>
                          <p style={{ margin: '0.25rem 0 0 0', color: '#6c757d', fontSize: '0.9rem' }}>
                            {user.email}
                          </p>
                          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              background: '#e7f3ff',
                              color: '#0d6efd'
                            }}>
                              <i className="bi bi-mortarboard me-1"></i>
                              Student
                            </span>
                            {user.createdAt && (
                              <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                                <i className="bi bi-calendar3 me-1"></i>
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          style={{
                            padding: '0.5rem 1rem',
                            border: '2px solid #dc3545',
                            background: 'transparent',
                            color: '#dc3545',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#dc3545';
                            e.currentTarget.style.color = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#dc3545';
                          }}
                        >
                          <i className="bi bi-trash"></i>
                          Remove
                        </button>
                      </div>
                    ))}
                    {students.filter(user => 
                      !searchTerm || 
                      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
                        <i className="bi bi-mortarboard" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                        <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
                          {searchTerm ? 'No students found matching your search' : 'No students registered yet'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Clients Section */}
              {activeSection === 'clients' && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '2rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {clients
                      .filter(user => 
                        !searchTerm || 
                        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(user => (
                      <div key={user._id} style={{
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        transition: 'all 0.3s ease',
                        border: '2px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#f5576c';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(245,87,108,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      >
                        <div style={{ flex: 1 }}>
                          <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#212529' }}>
                            {user.name}
                          </h5>
                          <p style={{ margin: '0.25rem 0 0 0', color: '#6c757d', fontSize: '0.9rem' }}>
                            {user.email}
                          </p>
                          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              background: '#ffe7f3',
                              color: '#d63384'
                            }}>
                              <i className="bi bi-briefcase me-1"></i>
                              Client
                            </span>
                            {user.createdAt && (
                              <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                                <i className="bi bi-calendar3 me-1"></i>
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          style={{
                            padding: '0.5rem 1rem',
                            border: '2px solid #dc3545',
                            background: 'transparent',
                            color: '#dc3545',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#dc3545';
                            e.currentTarget.style.color = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#dc3545';
                          }}
                        >
                          <i className="bi bi-trash"></i>
                          Remove
                        </button>
                      </div>
                    ))}
                    {clients.filter(user => 
                      !searchTerm || 
                      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
                        <i className="bi bi-building" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                        <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
                          {searchTerm ? 'No clients found matching your search' : 'No clients registered yet'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Jobs Section */}
              {activeSection === 'jobs' && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '2rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {jobs
                      .filter(job => 
                        !searchTerm || 
                        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        job.company?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(job => (
                      <div key={job._id} style={{
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        transition: 'all 0.3s ease',
                        border: '2px solid transparent',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#00f2fe';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,242,254,0.2)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: '0',
                          right: '0',
                          width: '100px',
                          height: '100px',
                          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                          opacity: 0.1,
                          borderRadius: '0 12px 0 100%'
                        }}></div>
                        
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div>
                              <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#212529' }}>
                                {job.title}
                              </h5>
                              <p style={{ margin: '0.25rem 0 0 0', color: '#6c757d', fontSize: '0.9rem' }}>
                                <i className="bi bi-building me-1"></i>
                                {job.company || 'N/A'}
                              </p>
                            </div>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              background: job.status === 'active' ? '#d1fae5' : '#fee2e2',
                              color: job.status === 'active' ? '#065f46' : '#991b1b'
                            }}>
                              {job.status || 'Active'}
                            </span>
                          </div>
                          
                          <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#6c757d' }}>
                              <i className="bi bi-geo-alt-fill"></i>
                              <span>{job.location || 'Location not specified'}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#6c757d' }}>
                              <i className="bi bi-briefcase-fill"></i>
                              <span>{job.type || 'Full-time'}</span>
                            </div>
                            {job.recruiter && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#6c757d' }}>
                                <i className="bi bi-person-fill"></i>
                                <span>Posted by {job.recruiter.name || 'Recruiter'}</span>
                              </div>
                            )}
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #dee2e6' }}>
                            <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                              <i className="bi bi-calendar3 me-1"></i>
                              {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              style={{
                                padding: '0.4rem 0.8rem',
                                border: '1px solid #dc3545',
                                background: 'transparent',
                                color: '#dc3545',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#dc3545';
                                e.currentTarget.style.color = '#fff';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#dc3545';
                              }}
                            >
                              <i className="bi bi-trash"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {jobs.filter(job => 
                      !searchTerm || 
                      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      job.company?.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length === 0 && (
                      <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
                        <i className="bi bi-briefcase" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                        <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
                          {searchTerm ? 'No jobs found matching your search' : 'No jobs posted yet'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Withdrawals Section */}
              {activeSection === 'withdrawals' && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '2rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {withdrawals
                      .filter(withdrawal => 
                        !searchTerm || 
                        withdrawal.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        withdrawal.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(withdrawal => (
                      <div key={withdrawal._id} style={{
                        background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        transition: 'all 0.3s ease',
                        border: '2px solid transparent',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#38f9d7';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(56,249,215,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          width: '4px',
                          height: '100%',
                          background: 'linear-gradient(180deg, #38f9d7 0%, #4facfe 100%)'
                        }}></div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
                          {/* User Info */}
                          <div style={{ flex: '1 1 200px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '1.2rem'
                              }}>
                                <i className="bi bi-person-fill"></i>
                              </div>
                              <div>
                                <p style={{ margin: 0, fontWeight: '600', fontSize: '1rem', color: '#212529' }}>
                                  {withdrawal.user?.name || 'Unknown User'}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#6c757d' }}>
                                  {withdrawal.user?.email}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Amount */}
                          <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Amount
                            </p>
                            <p style={{ 
                              margin: '0.25rem 0 0 0', 
                              fontSize: '1.5rem', 
                              fontWeight: '700', 
                              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}>
                              {withdrawal.currency} {withdrawal.amount?.toFixed(2)}
                            </p>
                          </div>
                          
                          {/* Method & Account */}
                          <div style={{ flex: '1 1 200px' }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <span style={{
                                padding: '0.3rem 0.8rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                background: '#e7f3ff',
                                color: '#0d6efd',
                                display: 'inline-block'
                              }}>
                                <i className="bi bi-credit-card me-1"></i>
                                {withdrawal.withdrawalMethod?.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6c757d', wordBreak: 'break-word' }}>
                              {withdrawal.accountDetails}
                            </p>
                          </div>
                          
                          {/* Date */}
                          <div style={{ flex: '0 0 auto' }}>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d' }}>
                              <i className="bi bi-calendar3 me-1"></i>
                              {new Date(withdrawal.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                              <br />
                              <span style={{ fontSize: '0.7rem' }}>
                                {new Date(withdrawal.createdAt).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </p>
                          </div>
                          
                          {/* Actions */}
                          <div style={{ flex: '0 0 auto', display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleApproveWithdrawal(withdrawal._id)}
                              style={{
                                padding: '0.6rem 1.2rem',
                                border: 'none',
                                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                color: '#fff',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 2px 8px rgba(17, 153, 142, 0.3)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(17, 153, 142, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(17, 153, 142, 0.3)';
                              }}
                            >
                              <i className="bi bi-check-circle-fill"></i>
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectWithdrawal(withdrawal._id)}
                              style={{
                                padding: '0.6rem 1.2rem',
                                border: '2px solid #dc3545',
                                background: 'transparent',
                                color: '#dc3545',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#dc3545';
                                e.currentTarget.style.color = '#fff';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#dc3545';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <i className="bi bi-x-circle-fill"></i>
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {withdrawals.filter(withdrawal => 
                      !searchTerm || 
                      withdrawal.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      withdrawal.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
                        <i className="bi bi-check-circle" style={{ fontSize: '4rem', opacity: 0.3, color: '#28a745' }}></i>
                        <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
                          {searchTerm ? 'No withdrawal requests found matching your search' : 'No pending withdrawals. All caught up!'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminDashboardPage;
