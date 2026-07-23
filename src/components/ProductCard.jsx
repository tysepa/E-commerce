import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Plus, Eye, Zap } from 'lucide-react';

export default function ProductCard({ product, onOpenDetails }) {
  const { addToCart } = useWeb3();

  return (
    <div className="product-card">
      {/* Product Image Container */}
      <div className="product-image-container" onClick={() => onOpenDetails(product)} style={{ cursor: 'pointer' }}>
        <img
          src={product.image || 'https://images.unsplash.com/photo-1531303435785-3853ba315a4a?auto=format&fit=crop&q=80&w=600'}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1531303435785-3853ba315a4a?auto=format&fit=crop&q=80&w=600';
          }}
        />
        
        {/* Dynamic Badges */}
        <div className="product-badges">
          {product.isMadeInRwanda && (
            <span className="badge-rwanda">
              🇷🇼 Made in Rwanda
            </span>
          )}
          {product.isElectrical && (
            <span className="badge-electrical">
              <Zap size={10} style={{ display: 'inline', marginRight: '2px' }} />
              Electrical
            </span>
          )}
        </div>
      </div>

      {/* Product Info Block */}
      <div className="product-info">
        <span className="product-cat">{product.category}</span>
        <h3 className="product-name" onClick={() => onOpenDetails(product)} style={{ cursor: 'pointer' }}>
          {product.name}
        </h3>
        <p className="product-desc">{product.description}</p>
        
        {/* Pricing Rows */}
        <div className="product-price-row" style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
          <span className="price-eth" style={{ fontSize: '1.2rem', color: 'var(--accent)', fontWeight: '800' }}>
            ${(product.priceEth * 3300).toFixed(2)}
          </span>
          <span className="price-usd" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            ≈ {Math.round(product.priceEth * 3300 * 1320).toLocaleString()} FRw
          </span>
        </div>

        {/* Action Buttons */}
        <div className="product-actions">
          <button
            className="btn btn-primary"
            onClick={() => addToCart(product)}
            style={{ width: '100%', padding: '8px 16px' }}
          >
            <Plus size={16} />
            <span>Add to Cart</span>
          </button>
          
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => onOpenDetails(product)}
            title="View Details"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
