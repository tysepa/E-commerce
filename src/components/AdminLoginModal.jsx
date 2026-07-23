import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { X, Lock, Key, AlertCircle } from 'lucide-react';

export default function AdminLoginModal() {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginAdmin
  } = useWeb3();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    // Add a tiny mock loading delay for security feel
    setTimeout(() => {
      const success = loginAdmin(username, password);
      setIsSubmitting(false);
      if (success) {
        setUsername('');
        setPassword('');
      } else {
        setErrorMsg('Invalid Username or Password. Please try again.');
      }
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsLoginModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} className="logo-accent" />
            <span>Admin Authentication</span>
          </h2>
          <button className="btn-icon" onClick={() => setIsLoginModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Access to the KigaliMart inventory controls and order records requires authorization signatures.
            </p>

            {/* Error Message */}
            {errorMsg && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                fontWeight: '600',
                marginBottom: '16px',
                border: '1px solid #fecaca'
              }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Username Input */}
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Epa"
                className="form-control"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-control"
                disabled={isSubmitting}
                required
              />
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              🔑 Credentials: Epa / Epa123
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsLoginModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
            >
              <Key size={16} />
              <span>{isSubmitting ? 'Verifying...' : 'Authorize Login'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
