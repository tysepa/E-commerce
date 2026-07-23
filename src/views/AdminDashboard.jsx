import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import AdminProductModal from '../components/AdminProductModal';
import { Plus, Edit, Trash2, ShieldCheck, DollarSign, Database, FileText, Copy } from 'lucide-react';

export default function AdminDashboard() {
  const {
    products,
    orders,
    deleteProduct,
    showToast
  } = useWeb3();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeEditProduct, setActiveEditProduct] = useState(null);

  // Statistics calculations
  const totalRevenueEth = orders.reduce((sum, order) => sum + order.totalEth, 0);
  const totalRevenueUsd = totalRevenueEth * 3300;
  const activeProductCount = products.length;
  const totalOrdersCount = orders.length;

  const handleEdit = (product) => {
    setActiveEditProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setActiveEditProduct(null);
    setIsFormOpen(true);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      
      {/* Header section */}
      <div className="admin-controls">
        <div>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={32} color="var(--accent)" />
            <span>Epa & Eva E2 Admin Hub</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Modify inventory, review decentralized order ledgers, and track store revenues.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={18} />
          <span>Register New Product</span>
        </button>
      </div>

      {/* Stats Cards (Metrics overview) */}
      <div className="admin-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Total Revenue</span>
            <DollarSign size={20} color="var(--accent)" />
          </div>
          <div className="admin-card-value eth">${totalRevenueUsd.toFixed(2)}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            ≈ {Math.round(totalRevenueUsd * 1320).toLocaleString()} FRw
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">On-Chain Orders</span>
            <FileText size={20} color="var(--accent)" />
          </div>
          <div className="admin-card-value">{totalOrdersCount} Completed</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Smart contract verified
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Active Inventory</span>
            <Database size={20} color="var(--accent)" />
          </div>
          <div className="admin-card-value">{activeProductCount} Items</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Live in store catalog
          </div>
        </div>
      </div>

      {/* Product Manager Inventory Grid/Table */}
      <div className="admin-section">
        <h2 className="admin-section-title">
          <Database size={20} className="logo-accent" />
          <span>Active Product Catalog</span>
        </h2>
        
        {products.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Product Title</th>
                  <th>Category</th>
                  <th>Price (USD)</th>
                  <th>Price (RWF)</th>
                  <th>Attributes</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <img src={prod.image} alt={prod.name} className="admin-table-thumb" />
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{prod.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>ID: {prod.id}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', backgroundColor: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px' }}>
                        {prod.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--accent)' }}>${(prod.priceEth * 3300).toFixed(2)}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{Math.round(prod.priceEth * 3300 * 1320).toLocaleString()} FRw</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {prod.isMadeInRwanda && (
                          <span title="Made in Rwanda" style={{ cursor: 'help' }}>🇷🇼</span>
                        )}
                        {prod.isElectrical && (
                          <span title="Electrical Material" style={{ cursor: 'help' }}>⚡</span>
                        )}
                        {!prod.isMadeInRwanda && !prod.isElectrical && (
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Standard</span>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(prod)}
                          title="Edit Item"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${prod.name}?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          title="Delete Item"
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
            No products in database. Click 'Register New Product' to mint one.
          </div>
        )}
      </div>

      {/* Completed Orders / On-Chain Transaction Logs */}
      <div className="admin-section">
        <h2 className="admin-section-title">
          <FileText size={20} className="logo-accent" />
          <span>Rwanda Devnet Transactions (Order Logs)</span>
        </h2>
        
        {orders.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Timestamp</th>
                  <th>Buyer Node Address</th>
                  <th>Items Minted</th>
                  <th>Value</th>
                  <th>Destination</th>
                  <th>Timeline</th>
                  <th>Tx Hash</th>
                  <th>Ledger State</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: '700' }}>{order.id}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.date}</td>
                    <td className="hash-text" style={{ fontSize: '0.82rem' }}>
                      <span
                        onClick={() => copyToClipboard(order.buyer, 'Buyer Address')}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Copy Address"
                      >
                        {truncateAddress(order.buyer)}
                        <Copy size={10} />
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.items.join(', ')}
                      </div>
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--accent)', fontSize: '0.85rem' }}>
                      <div>${(order.totalEth * 3300).toFixed(2)}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                        {Math.round(order.totalEth * 3300 * 1320).toLocaleString()} FRw
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                      {order.location || 'Kigali'}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: '700' }}>
                      {order.deliveryTime || '3 Hours'}
                    </td>
                    <td className="hash-text" style={{ fontSize: '0.82rem' }}>
                      <span
                        onClick={() => copyToClipboard(order.txHash, 'Transaction Hash')}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Copy Tx Hash"
                      >
                        {truncateAddress(order.txHash)}
                        <Copy size={10} />
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        backgroundColor: 'var(--success-light)',
                        color: 'var(--success)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #bbf7d0'
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
            No transaction records found on-chain. Place order via storefront to record transactions.
          </div>
        )}
      </div>

      {/* Admin Form Modal */}
      {isFormOpen && (
        <AdminProductModal
          product={activeEditProduct}
          onClose={() => {
            setIsFormOpen(false);
            setActiveEditProduct(null);
          }}
        />
      )}

    </div>
  );
}
