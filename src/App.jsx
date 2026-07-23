import React from 'react';
import { Web3Provider, useWeb3 } from './context/Web3Context';
import Header from './components/Header';
import Storefront from './views/Storefront';
import AdminDashboard from './views/AdminDashboard';
import WalletModal from './components/WalletModal';
import TransactionModal from './components/TransactionModal';
import AdminLoginModal from './components/AdminLoginModal';
import BrandLogo from './components/BrandLogo';

function AppContent() {
  const {
    isAdminMode,
    setIsAdminMode,
    isAdminAuthenticated,
    setIsLoginModalOpen,
    logoutAdmin,
    smsNotification,
    setSmsNotification
  } = useWeb3();

  return (
    <div className="app-container">
      {/* Global Navigation Header */}
      <Header />

      {/* Main View Router */}
      <main className="main-content">
        {isAdminMode ? <AdminDashboard /> : <Storefront />}
      </main>

      {/* Global Modals */}
      <WalletModal />
      <TransactionModal />
      <AdminLoginModal />

      {/* Footer */}
      <footer style={{
        backgroundColor: '#111827',
        color: '#9ca3af',
        padding: '40px 0',
        fontSize: '0.88rem',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            textAlign: 'left'
          }}>
            <div>
              <div style={{ marginBottom: '12px' }}>
                <BrandLogo height={38} showSubtitle={true} />
              </div>
              <p style={{ marginBottom: '16px', maxWidth: '500px', fontSize: '0.85rem' }}>
                Decentralized e-commerce mock network. Built with React JS and custom high-contrast CSS.
              </p>
              <div style={{
                display: 'flex',
                gap: '24px',
                fontSize: '0.8rem',
                opacity: 0.8
              }}>
                <span>🌐 Network: Rwanda Devnet</span>
                <span>📝 Contract: ERC-1155 Multi-Token</span>
                <span>🔒 Secure Ledger</span>
              </div>
            </div>

            {/* Admin Switcher Toggle in Footer */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <button
                className="btn btn-wallet"
                onClick={() => {
                  if (isAdminMode) {
                    setIsAdminMode(false);
                  } else {
                    if (isAdminAuthenticated) {
                      setIsAdminMode(true);
                    } else {
                      setIsLoginModalOpen(true);
                    }
                  }
                }}
                style={{
                  backgroundColor: isAdminMode ? 'var(--accent)' : 'transparent',
                  color: isAdminMode ? 'white' : 'var(--accent)',
                  borderColor: 'var(--accent)',
                  fontSize: '0.85rem',
                  padding: '8px 16px'
                }}
              >
                <span>🔑 {isAdminMode ? 'Customer Portal' : 'Admin Hub Portal'}</span>
              </button>
              {isAdminAuthenticated && (
                <button
                  onClick={logoutAdmin}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    textDecoration: 'underline',
                    padding: '0',
                    marginTop: '2px'
                  }}
                >
                  Log Out Administrator
                </button>
              )}
              <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                © {new Date().getFullYear()} KigaliMart. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      {/* Floating SMS Push Notification for Merchant Epa */}
      {smsNotification && (
        <div className="sms-push-banner" style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          width: '340px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
          borderLeft: '5px solid #fcca03',
          padding: '16px',
          zIndex: '99999',
          fontFamily: "'Outfit', 'Inter', sans-serif",
          animation: 'smsSlideIn 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#fcca03', fontWeight: '700' }}>
              <span>💬 SMS RECEIVED</span>
              <span>•</span>
              <span>{smsNotification.timestamp}</span>
            </div>
            <button
              onClick={() => setSmsNotification(null)}
              style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px', lineHeight: '1' }}
            >
              ×
            </button>
          </div>
          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#f3f4f6', marginBottom: '6px' }}>
            To: {smsNotification.phone} (Epa)
          </div>
          <p style={{ fontSize: '0.8rem', color: '#d1d5db', lineHeight: '1.4', margin: '0' }}>
            {smsNotification.message}
          </p>
          <style>{`
            @keyframes smsSlideIn {
              from { transform: translateX(120%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  );
}
