import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ShoppingBag, Wallet, ShieldCheck, User } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Header() {
  const {
    cart,
    isAdminMode,
    setIsAdminMode,
    setIsCartOpen,
    setIsWalletModalOpen,
    walletConnected,
    walletAddress,
    disconnectWallet
  } = useWeb3();

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="header">
      <div className="container header-inner">
        {/* Branding Logo */}
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setIsAdminMode(false)}>
          <BrandLogo />
        </div>


        {/* Right Navigation / Controls */}
        <nav className="header-actions">
          {/* Cart Icon (only in Customer Mode) */}
          {!isAdminMode && (
            <button
              className="btn-icon"
              onClick={() => setIsCartOpen(true)}
              style={{ position: 'relative' }}
            >
              <ShoppingBag size={22} />
              {cartItemsCount > 0 && (
                <span className="badge-count">{cartItemsCount}</span>
              )}
            </button>
          )}

          {/* Web3 Wallet Connect */}
          {walletConnected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="btn btn-wallet connected"
                onClick={disconnectWallet}
                title="Click to Disconnect Wallet"
              >
                <Wallet size={16} />
                <span>{formatAddress(walletAddress)}</span>
              </button>
            </div>
          ) : (
            <button
              className="btn btn-wallet"
              onClick={() => setIsWalletModalOpen(true)}
            >
              <Wallet size={16} />
              <span>Connect Wallet</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
