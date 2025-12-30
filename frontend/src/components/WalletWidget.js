import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const WalletWidget = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const { data } = await api.get('/wallet');
      setWallet(data.wallet);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      // Set default values on error
      setWallet({ balance: 0, availableBalance: 0, escrowBalance: 0, currency: 'USD', totalEarned: 0, totalSpent: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="card-body p-4 text-center">
          <div className="spinner-border spinner-border-sm text-white" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '18px', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', overflow: 'hidden', position: 'relative' }}>
      {/* Background Icon */}
      <div style={{ position: 'absolute', top: -30, right: -30, fontSize: '150px', opacity: 0.06, transform: 'rotate(15deg)', color: 'rgba(255,255,255,0.85)' }}>
        <i className="bi bi-wallet2"></i>
      </div>
      
      <div className="card-body p-4" style={{ position: 'relative', zIndex: 1 }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <div className="rounded-circle p-2 me-2" style={{ background: 'rgba(255,255,255,0.08)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-wallet2 text-white fs-5" aria-hidden="true"></i>
            </div>
            <h6 className="text-white mb-0 fw-bold">My Wallet</h6>
          </div>
          <Link to="/wallet" className="btn btn-sm btn-light rounded-circle" style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-arrow-right fw-bold"></i>
          </Link>
        </div>

        <div className="text-center mb-4 py-3">
          <div className="small mb-2" style={{ color: 'rgba(255,255,255,0.9)' }}>Available Balance</div>
          <h2 className="fw-bold mb-0" style={{ color: '#ffffff', fontSize: '2.4rem', letterSpacing: '0.5px' }}>
            ${wallet?.availableBalance?.toFixed(2) || '0.00'}
          </h2>
        </div>

        {wallet?.escrowBalance > 0 && (
          <div className="rounded-3 p-2 mb-3 text-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <small style={{ color: 'rgba(255,255,255,0.95)' }}>
              <i className="bi bi-lock me-1"></i>
              Escrow: ${wallet.escrowBalance.toFixed(2)}
            </small>
          </div>
        )}

        <div className="row g-2 mb-3">
          <div className="col-6">
            <div className="text-center">
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem' }}>Earned</div>
              <div className="fw-bold small" style={{ marginTop: '4px' }}>
                <span style={{ background: 'rgba(255,255,255,0.95)', color: '#0f8a4a', padding: '4px 8px', borderRadius: '999px', fontWeight: 700 }}>
                  +${wallet?.totalEarned?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="text-center">
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem' }}>Spent</div>
              <div className="fw-bold small" style={{ marginTop: '4px' }}>
                <span style={{ background: 'rgba(255,255,255,0.95)', color: '#c92a2a', padding: '4px 8px', borderRadius: '999px', fontWeight: 700 }}>
                  -${wallet?.totalSpent?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Link to="/wallet" className="btn btn-sm w-100 fw-semibold shadow-sm" style={{ background: '#ffffff', color: '#0b2540', fontWeight: 700 }}>
          <i className="bi bi-eye me-1"></i>
          View Wallet
        </Link>
      </div>
    </div>
  );
};

export default WalletWidget;
