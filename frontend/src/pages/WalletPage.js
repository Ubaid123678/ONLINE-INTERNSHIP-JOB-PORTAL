import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { extractErrorMessage } from '../services/api';

const WalletPage = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [addFundsForm, setAddFundsForm] = useState({ amount: '', description: '' });
  const [withdrawForm, setWithdrawForm] = useState({ amount: '', withdrawalMethod: 'bank_transfer', accountDetails: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchWalletData();
    // eslint-disable-next-line
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [walletRes, transactionsRes, statsRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/wallet/transactions?limit=20'),
        api.get('/wallet/stats')
      ]);
      setWallet(walletRes.data.wallet);
      setTransactions(transactionsRes.data.transactions || []);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Wallet error:', err);
      setError(extractErrorMessage(err));
      setWallet({ balance: 0, availableBalance: 0, escrowBalance: 0, currency: 'USD', totalEarned: 0, totalSpent: 0 });
      setStats({ totalEarned: 0, totalSpent: 0, totalWithdrawn: 0, pendingWithdrawals: 0, escrowBalance: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionMessage({ type: '', text: '' });
    try {
      await api.post('/wallet/add-funds', addFundsForm);
      setActionMessage({ type: 'success', text: 'Funds added successfully!' });
      setAddFundsForm({ amount: '', description: '' });
      setShowAddFunds(false);
      fetchWalletData();
    } catch (err) {
      setActionMessage({ type: 'error', text: extractErrorMessage(err) });
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionMessage({ type: '', text: '' });
    try {
      await api.post('/wallet/withdraw', withdrawForm);
      setActionMessage({ type: 'success', text: 'Withdrawal request submitted!' });
      setWithdrawForm({ amount: '', withdrawalMethod: 'bank_transfer', accountDetails: '' });
      setShowWithdraw(false);
      fetchWalletData();
    } catch (err) {
      setActionMessage({ type: 'error', text: extractErrorMessage(err) });
    } finally {
      setActionLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    if (activeTab === 'all') return transactions;
    if (activeTab === 'income') return transactions.filter(t => ['credit', 'earning', 'refund', 'escrow_release'].includes(t.type));
    if (activeTab === 'expense') return transactions.filter(t => ['debit', 'payment', 'withdrawal', 'escrow_hold'].includes(t.type));
    return transactions;
  };

  const getTransactionIcon = (type) => {
    const icons = {
      credit: 'bi-arrow-down-circle-fill',
      earning: 'bi-trophy-fill',
      refund: 'bi-arrow-counterclockwise',
      escrow_release: 'bi-unlock-fill',
      debit: 'bi-arrow-up-circle-fill',
      payment: 'bi-credit-card-fill',
      withdrawal: 'bi-bank',
      escrow_hold: 'bi-lock-fill'
    };
    return icons[type] || 'bi-circle-fill';
  };

  const getTransactionColor = (type) => {
    if (['credit', 'earning', 'refund', 'escrow_release'].includes(type)) return 'success';
    if (['debit', 'payment', 'withdrawal'].includes(type)) return 'danger';
    if (type === 'escrow_hold') return 'warning';
    return 'secondary';
  };

  const formatType = (type) => type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center text-white">
          <div className="spinner-border mb-3" style={{ width: '4rem', height: '4rem' }} role="status"></div>
          <h4>Loading your wallet...</h4>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      <div className="container">
        {/* Smart Header */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h3 className="text-white fw-bold mb-1">
                  <i className="bi bi-wallet2 me-2"></i>Smart Wallet
                </h3>
                <p className="text-white opacity-75 mb-0 small">{user?.name}</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-light shadow-sm" onClick={() => setShowAddFunds(true)}>
                  <i className="bi bi-plus-lg me-1"></i>Add
                </button>
                <button 
                  className="btn btn-outline-light" 
                  onClick={() => setShowWithdraw(true)}
                  disabled={!wallet?.availableBalance || wallet?.availableBalance <= 0}
                >
                  <i className="bi bi-arrow-up-circle me-1"></i>Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {actionMessage.text && (
          <div className={`alert alert-${actionMessage.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show shadow-sm mb-2 py-2`}>
            <i className={`bi ${actionMessage.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
            <small>{actionMessage.text}</small>
            <button type="button" className="btn-close btn-close-sm" onClick={() => setActionMessage({ type: '', text: '' })}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-warning alert-dismissible fade show shadow-sm mb-2 py-2">
            <i className="bi bi-info-circle-fill me-2"></i>
            <small>{error}</small>
            <button type="button" className="btn-close btn-close-sm" onClick={() => setError(null)}></button>
          </div>
        )}

        {/* Balance Cards */}
        <div className="row g-3 mb-3">
          {/* Main Balance Card */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '18px', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', overflow: 'hidden' }}>
              <div className="card-body p-3" style={{ position: 'relative' }}>
                {/* Background Icon */}
                <div style={{ position: 'absolute', top: -10, right: -10, fontSize: '120px', opacity: 0.08, transform: 'rotate(15deg)', color: 'rgba(255,255,255,0.85)' }}>
                  <i className="bi bi-wallet2"></i>
                </div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div className="d-flex align-items-center mb-2">
                    <div className="bg-white bg-opacity-20 rounded-circle p-1 me-2" style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-wallet-fill text-white"></i>
                    </div>
                    <div className="text-white opacity-75 small">Total Balance</div>
                  </div>
                  
                  <h2 className="text-white fw-bold mb-3" style={{ fontSize: '2.2rem', letterSpacing: '1px' }}>
                    {'$'}{(wallet?.balance || 0).toFixed(2)}
                  </h2>
                  
                  <div className="row g-2">
                    <div className="col-md-6">
                      <div className="bg-white p-2 rounded-3 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Available</div>
                            <h6 className="text-dark fw-bold mb-0">{'$'}{(wallet?.availableBalance || 0).toFixed(2)}</h6>
                          </div>
                          <div style={{ background: 'var(--brand-green)', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="bi bi-check-circle-fill text-white"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="bg-white p-2 rounded-3 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>In Escrow</div>
                            <h6 className="text-dark fw-bold mb-0">{'$'}{(wallet?.escrowBalance || 0).toFixed(2)}</h6>
                          </div>
                          <div style={{ background: 'var(--brand-blue)', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="bi bi-hourglass-split text-white"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="col-lg-4">
            <div className="row g-2">
              <div className="col-12">
                <div className="card border-0 shadow" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
                  <div className="card-body p-2">
                    <div className="d-flex align-items-center">
                      <div className="bg-white bg-opacity-25 rounded-circle p-2 me-2">
                        <i className="bi bi-graph-up-arrow text-white fs-5"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="text-white opacity-75" style={{ fontSize: '0.7rem' }}>Total Earned</div>
                        <h6 className="text-white fw-bold mb-0">+{'$'}{(stats?.totalEarned || 0).toFixed(2)}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-12">
                <div className="card border-0 shadow" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
                  <div className="card-body p-2">
                    <div className="d-flex align-items-center">
                      <div className="bg-white bg-opacity-25 rounded-circle p-2 me-2">
                        <i className="bi bi-graph-down-arrow text-white fs-5"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="text-white opacity-75" style={{ fontSize: '0.7rem' }}>Total Spent</div>
                        <h6 className="text-white fw-bold mb-0">-{'$'}{(stats?.totalSpent || 0).toFixed(2)}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card border-0 shadow" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
                  <div className="card-body p-2">
                    <div className="d-flex align-items-center">
                      <div className="bg-white bg-opacity-25 rounded-circle p-2 me-2">
                        <i className="bi bi-bank2 text-white fs-5"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="text-white opacity-75" style={{ fontSize: '0.7rem' }}>Withdrawn</div>
                        <h6 className="text-white fw-bold mb-0">{'$'}{(stats?.totalWithdrawn || 0).toFixed(2)}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="card border-0 shadow-lg" style={{ borderRadius: '18px', overflow: 'hidden' }}>
          <div className="card-header bg-white border-0 p-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-clock-history me-2" style={{ color: '#667eea' }}></i>
                Transactions
              </h5>
              {stats?.pendingWithdrawals > 0 && (
                <span className="badge bg-warning text-dark px-2 py-1 small">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {stats.pendingWithdrawals} Pending
                </span>
              )}
            </div>
            
            {/* Filter Tabs */}
            <div className="btn-group w-100 shadow-sm" role="group">
              <button 
                className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('all')}
              >
                <i className="bi bi-list-ul me-1"></i>All
              </button>
              <button 
                className={`btn btn-sm ${activeTab === 'income' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setActiveTab('income')}
              >
                <i className="bi bi-arrow-down-circle me-1"></i>Income
              </button>
              <button 
                className={`btn btn-sm ${activeTab === 'expense' ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => setActiveTab('expense')}
              >
                <i className="bi bi-arrow-up-circle me-1"></i>Expense
              </button>
            </div>
          </div>

          <div className="card-body p-0">
            {getFilteredTransactions().length === 0 ? (
              <div className="text-center py-4">
                <div className="mb-3" style={{ fontSize: '60px', opacity: 0.2 }}>
                  <i className="bi bi-inbox"></i>
                </div>
                <h6 className="fw-bold text-muted mb-1">No Transactions</h6>
                <p className="text-muted small mb-3">Your history will appear here</p>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddFunds(true)}>
                  <i className="bi bi-plus-circle me-1"></i>Add Funds
                </button>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {getFilteredTransactions().map((txn) => (
                  <div 
                    key={txn._id} 
                    className="list-group-item list-group-item-action border-0 p-2" 
                    style={{ 
                      borderLeft: `3px solid var(--bs-${getTransactionColor(txn.type)})`,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <div 
                        className={`bg-${getTransactionColor(txn.type)} bg-opacity-10 rounded-circle p-2 me-2`}
                        style={{ minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <i className={`bi ${getTransactionIcon(txn.type)} text-${getTransactionColor(txn.type)}`}></i>
                      </div>
                      
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-0 fw-bold small">{formatType(txn.type)}</h6>
                            <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>{txn.description}</p>
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                              <i className="bi bi-calendar3 me-1"></i>
                              {new Date(txn.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </small>
                          </div>
                          
                          <div className="text-end">
                            <h6 className={`mb-1 fw-bold text-${getTransactionColor(txn.type)}`}>
                              {['credit', 'earning', 'refund', 'escrow_release'].includes(txn.type) ? '+' : '-'}{'$'}{txn.amount?.toFixed(2)}
                            </h6>
                            <span className={`badge bg-${txn.status === 'completed' ? 'success' : txn.status === 'pending' ? 'warning text-dark' : 'danger'}`} style={{ fontSize: '0.65rem' }}>
                              {txn.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '18px', overflow: 'hidden' }}>
              <div className="modal-header border-0 p-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <h6 className="modal-title text-white fw-bold mb-0">
                  <i className="bi bi-plus-circle-fill me-2"></i>Add Funds
                </h6>
                <button type="button" className="btn-close btn-close-white btn-sm" onClick={() => setShowAddFunds(false)}></button>
              </div>
              <form onSubmit={handleAddFunds}>
                <div className="modal-body p-3">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      <i className="bi bi-currency-dollar me-1"></i>Amount ($)
                    </label>
                    <div className="input-group shadow-sm">
                      <span className="input-group-text bg-light border-0">
                        <i className="bi bi-cash-stack"></i>
                      </span>
                      <input
                        type="number"
                        className="form-control border-0 bg-light"
                        placeholder="0.00"
                        value={addFundsForm.amount}
                        onChange={(e) => setAddFundsForm({ ...addFundsForm, amount: e.target.value })}
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      <i className="bi bi-pencil me-1"></i>Description (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-control border-0 bg-light shadow-sm"
                      placeholder="e.g., Project deposit"
                      value={addFundsForm.description}
                      onChange={(e) => setAddFundsForm({ ...addFundsForm, description: e.target.value })}
                    />
                  </div>
                  <div className="alert alert-info border-0 py-2 mb-0">
                    <small><i className="bi bi-info-circle me-1"></i>Production: Integrates with payment gateways</small>
                  </div>
                </div>
                <div className="modal-footer border-0 bg-light p-2">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddFunds(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm px-3" disabled={actionLoading}>
                    {actionLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span>Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-1"></i>Add Funds
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '18px', overflow: 'hidden' }}>
              <div className="modal-header border-0 p-3" style={{ background: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)' }}>
                <h6 className="modal-title text-white fw-bold mb-0">
                  <i className="bi bi-arrow-up-circle-fill me-2"></i>Withdraw Funds
                </h6>
                <button type="button" className="btn-close btn-close-white btn-sm" onClick={() => setShowWithdraw(false)}></button>
              </div>
              <form onSubmit={handleWithdraw}>
                <div className="modal-body p-3">
                  <div className="alert alert-success border-0 py-2 mb-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-wallet2 fs-5 me-2"></i>
                      <div>
                        <small className="opacity-75">Available</small>
                        <div className="fw-bold">{'$'}{(wallet?.availableBalance || 0).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      <i className="bi bi-currency-dollar me-1"></i>Amount ($)
                    </label>
                    <div className="input-group shadow-sm">
                      <span className="input-group-text bg-light border-0">
                        <i className="bi bi-cash-stack"></i>
                      </span>
                      <input
                        type="number"
                        className="form-control border-0 bg-light"
                        placeholder="0.00"
                        value={withdrawForm.amount}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                        min="0.01"
                        max={wallet?.availableBalance || 0}
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      <i className="bi bi-credit-card me-1"></i>Method
                    </label>
                    <select
                      className="form-select border-0 bg-light shadow-sm"
                      value={withdrawForm.withdrawalMethod}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, withdrawalMethod: e.target.value })}
                      required
                    >
                      <option value="bank_transfer">🏦 Bank Transfer</option>
                      <option value="paypal">💳 PayPal</option>
                      <option value="stripe">💰 Stripe</option>
                      <option value="jazzcash">📱 JazzCash</option>
                      <option value="easypaisa">📱 Easypaisa</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      <i className="bi bi-card-text me-1"></i>Account Details
                    </label>
                    <textarea
                      className="form-control border-0 bg-light shadow-sm"
                      rows="3"
                      placeholder="Account number, IBAN, email, or phone..."
                      value={withdrawForm.accountDetails}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, accountDetails: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="alert alert-warning border-0 py-2 mb-0">
                    <small><i className="bi bi-clock me-1"></i>Processed within 3-5 business days</small>
                  </div>
                </div>
                <div className="modal-footer border-0 bg-light p-2">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowWithdraw(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger btn-sm px-3" disabled={actionLoading}>
                    {actionLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span>Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-1"></i>Submit
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
