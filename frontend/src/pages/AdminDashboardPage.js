import { useEffect, useState } from 'react';
import api, { extractErrorMessage } from '../services/api';

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [metrics, setMetrics] = useState({ users: 0, jobs: 0, applications: 0 });
  const [pendingPayments, setPendingPayments] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [{ data: usersData }, { data: jobsData }, { data: metricsData }, { data: paymentsData }] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/jobs'),
          api.get('/admin/metrics'),
          api.get('/admin/payments/pending')
        ]);
        setUsers(usersData.users || usersData);
        setJobs(jobsData.jobs || jobsData);
        setMetrics(metricsData);
        setPendingPayments(paymentsData.applications || []);
      } catch (err) {
        setError(extractErrorMessage(err));
        setUsers([
          { _id: 'u-1', name: 'Demo Student', role: 'student', email: 'student@example.com' },
          { _id: 'u-2', name: 'Demo Recruiter', role: 'recruiter', email: 'recruiter@example.com' }
        ]);
        setJobs([
          { _id: 'j-1', title: 'Frontend Intern', company: 'Demo Co', status: 'active' },
          { _id: 'j-2', title: 'Data Analyst', company: 'Demo Co', status: 'draft' }
        ]);
        setMetrics({ users: 2, jobs: 2, applications: 0 });
      }
    };

    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await api.delete(`/admin/jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleApprovePayment = async (applicationId) => {
    try {
      setError(null);
      setSuccess(null);
      await api.post(`/admin/payments/${applicationId}/approve`);
      setPendingPayments((prev) => prev.filter((app) => app._id !== applicationId));
      setSuccess('Payment approved and released to student successfully!');
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleRejectPayment = async (applicationId) => {
    try {
      setError(null);
      setSuccess(null);
      const reason = prompt('Enter rejection reason (optional):');
      await api.post(`/admin/payments/${applicationId}/reject`, { reason });
      setPendingPayments((prev) => prev.filter((app) => app._id !== applicationId));
      setSuccess('Payment rejected and funds returned to client successfully!');
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">Admin dashboard</h1>
        <span className="badge bg-dark">Moderator tools</span>
      </div>
      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" className="btn-close" onClick={() => setError(null)}></button>
      </div>}
      {success && <div className="alert alert-success alert-dismissible fade show" role="alert">
        {success}
        <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
      </div>}

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Payment Approvals
            {pendingPayments.length > 0 && (
              <span className="badge bg-danger ms-2">{pendingPayments.length}</span>
            )}
          </button>
        </li>
      </ul>

      {activeTab === 'overview' && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm dashboard-card">
                <div className="card-body">
                  <p className="text-muted small mb-1">Total users</p>
                  <h2 className="fw-semibold">{metrics.users}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm dashboard-card">
                <div className="card-body">
                  <p className="text-muted small mb-1">Jobs</p>
                  <h2 className="fw-semibold">{metrics.jobs}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm dashboard-card">
                <div className="card-body">
                  <p className="text-muted small mb-1">Applications</p>
                  <h2 className="fw-semibold">{metrics.applications}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Users</h5>
                  <div className="table-responsive mt-3">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className="badge bg-secondary-subtle text-dark text-capitalize">{user.role}</span>
                            </td>
                            <td className="text-end">
                              <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDeleteUser(user._id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan="4" className="text-center text-muted">
                              No users available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Jobs & internships</h5>
                  <div className="table-responsive mt-3">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Company</th>
                          <th>Status</th>
                          <th>Recruiter</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map((job) => (
                          <tr key={job._id}>
                            <td>{job.title}</td>
                            <td>{job.company || '—'}</td>
                            <td>
                              <span className="badge bg-light text-dark text-capitalize">{job.status || 'active'}</span>
                            </td>
                            <td>{job.recruiter?.name || '—'}</td>
                            <td className="text-end">
                              <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDeleteJob(job._id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                        {jobs.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center text-muted">
                              No jobs available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'payments' && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Pending Payment Approvals</h5>
                <p className="text-muted">Review and approve student payments for completed projects</p>
                <div className="table-responsive mt-3">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Job Title</th>
                        <th>Client</th>
                        <th>Amount</th>
                        <th>Submitted</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingPayments.map((application) => (
                        <tr key={application._id}>
                          <td>
                            <div>
                              <strong>{application.student?.name}</strong>
                              <br />
                              <small className="text-muted">{application.student?.email}</small>
                            </div>
                          </td>
                          <td>
                            <strong>{application.job?.title}</strong>
                            <br />
                            <small className="text-muted">{application.job?.company || 'N/A'}</small>
                          </td>
                          <td>{application.job?.recruiter?.name || 'N/A'}</td>
                          <td>
                            <span className="badge bg-success-subtle text-success fs-6">
                              {application.job?.currency || 'USD'} {application.payment?.amount || application.job?.paymentAmount}
                            </span>
                          </td>
                          <td>
                            {application.projectSubmission?.submittedAt 
                              ? new Date(application.projectSubmission.submittedAt).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td className="text-end">
                            <button 
                              className="btn btn-sm btn-success me-2" 
                              onClick={() => handleApprovePayment(application._id)}
                            >
                              ✓ Approve
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              onClick={() => handleRejectPayment(application._id)}
                            >
                              ✗ Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                      {pendingPayments.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center text-muted py-4">
                            No pending payment approvals.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
