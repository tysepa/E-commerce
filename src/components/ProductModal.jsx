import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { X, Plus, HardDrive, Link, Copy } from 'lucide-react';

export default function ProductModal({ product, onClose }) {
  const { addToCart, showToast } = useWeb3();

  if (!product) return null;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem' }}>Product Specifications</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="detail-grid">
            {/* Image & Badges */}
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="detail-img"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1531303435785-3853ba315a4a?auto=format&fit=crop&q=80&w=600';
                }}
              />
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                {product.isMadeInRwanda && (
                  <span className="badge-rwanda">🇷🇼 Made in Rwanda</span>
                )}
                {product.isElectrical && (
                  <span className="badge-electrical">⚡ Electrical</span>
                )}
              </div>
            </div>

            {/* Info and Web3 Details */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="product-cat" style={{ fontSize: '0.85rem' }}>{product.category}</span>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{product.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {product.description}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
                  <span className="price-eth" style={{ fontSize: '1.6rem', color: 'var(--accent)', fontWeight: '800' }}>
                    ${(product.priceEth * 3300).toFixed(2)}
                  </span>
                  <span className="price-usd" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    ≈ {Math.round(product.priceEth * 3300 * 1320).toLocaleString()} FRw
                  </span>
                </div>
              </div>

              {/* Web3 Blockchain Identity Card */}
              <div className="web3-card">
                <div className="web3-card-title">
                  <HardDrive size={14} />
                  <span>Decentralized Asset Info</span>
                </div>
                
                <div className="web3-data-row">
                  <span>Smart Contract</span>
                  <span
                    className="hash-text"
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => copyToClipboard(product.contractAddress || '0xRw8bFA127bc9E3c8466a9829377484B', 'Contract Address')}
                  >
                    {product.contractAddress || '0xRw8bF...73a2'}
                    <Copy size={12} />
                  </span>
                </div>

                <div className="web3-data-row">
                  <span>Asset Standard</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {product.tokenStandard || 'ERC-1155'}
                  </span>
                </div>

                <div className="web3-data-row">
                  <span>Metadata Storage</span>
                  <span
                    className="hash-text"
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => copyToClipboard(product.ipfsHash || 'ipfs://QmZzW488qRw', 'IPFS URI')}
                  >
                    {product.ipfsHash ? `${product.ipfsHash.substring(0, 15)}...` : 'ipfs://QmZzW...'}
                    <Copy size={12} />
                  </span>
                </div>

                <div className="web3-data-row">
                  <span>Consensus Node</span>
                  <span>Kigali Validator</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          
          <button
            className="btn btn-primary"
            onClick={() => {
              addToCart(product);
              onClose();
            }}
          >
            <Plus size={16} />
            <span>Add to Cart</span>
          </button>
        </div>

      </div>
    </div>
  );
}
