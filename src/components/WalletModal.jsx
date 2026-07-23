import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { X, Wallet, Loader2 } from 'lucide-react';

export default function WalletModal() {
  const { isWalletModalOpen, setIsWalletModalOpen, connectWallet } = useWeb3();
  const [connectingType, setConnectingType] = useState(null);

  if (!isWalletModalOpen) return null;

  const handleConnect = (type) => {
    setConnectingType(type);
    connectWallet(type);
  };

  const walletOptions = [
    {
      id: 'metaMask',
      name: 'MetaMask',
      icon: '🦊',
      desc: 'Connect using your MetaMask extension or mobile app.'
    },
    {
      id: 'walletConnect',
      name: 'WalletConnect',
      icon: '🔗',
      desc: 'Scan QR code with your mobile crypto wallet.'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🛡️',
      desc: 'Securely link to your Coinbase account.'
    }
  ];

  return (
    <div className="modal-backdrop" onClick={() => setIsWalletModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wallet size={20} className="logo-accent" />
            <span>Connect Web3 Wallet</span>
          </h2>
          <button className="btn-icon" onClick={() => setIsWalletModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
            Select a compatible blockchain wallet to authorize cryptographic sign-ins and secure ETH checkouts.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {walletOptions.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleConnect(wallet.id)}
                disabled={connectingType !== null}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  width: '100%',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition)'
                }}
                className="wallet-option-btn"
                onMouseEnter={(e) => {
                  if (connectingType === null) {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.backgroundColor = 'var(--accent-light)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (connectingType === null) {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={{ fontSize: '2rem' }}>{wallet.icon}</div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{wallet.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{wallet.desc}</div>
                </div>

                {connectingType === wallet.id && (
                  <div style={{ animation: 'spin 1.5s linear infinite' }}>
                    <Loader2 size={20} color="var(--accent)" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setIsWalletModalOpen(false)}>
            Cancel
          </button>
        </div>

      </div>
      
      {/* Dynamic inline loader animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
