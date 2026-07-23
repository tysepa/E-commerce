import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import ProductSlider from '../components/ProductSlider';
import { Search, ShoppingBag, X, Zap, Trash2, ArrowRight, Award } from 'lucide-react';

export default function Storefront() {
  const {
    products,
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    checkoutWithCrypto,
    walletConnected,
    walletBalance,
    showToast,
    checkoutWithMomo
  } = useWeb3();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [cartPaymentMethod, setCartPaymentMethod] = useState('crypto'); // 'crypto' | 'momo'
  const [clientMomoNumber, setClientMomoNumber] = useState('+250782148861');
  const [momoSubMethod, setMomoSubMethod] = useState('push'); // 'push' | 'qr'
  const [shippingLocation, setShippingLocation] = useState('Kigali'); // 'Kigali' | 'Outside Kigali' | 'Outside Rwanda'
  const [locationPromptOpen, setLocationPromptOpen] = useState(true);
  const [deviceCoords, setDeviceCoords] = useState(null);
  const [converterAmount, setConverterAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('RWF');

  useEffect(() => {
    setVisibleProducts(6);
  }, [selectedCategory, searchQuery]);

  const requestDeviceLocation = () => {
    if (!navigator.geolocation) {
      showToast('⚠️ Geolocation is not supported by your browser.');
      setLocationPromptOpen(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDeviceCoords(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        setLocationPromptOpen(false);

        // Approximate Rwanda limits: Lat between -2.9 and -1.0, Lng between 28.8 and 30.9
        const isRwanda = latitude > -2.9 && latitude < -1.0 && longitude > 28.8 && longitude < 30.9;
        // Approximate Kigali limits: Lat between -2.0 and -1.8, Lng between 29.9 and 30.2
        const isKigali = latitude > -2.0 && latitude < -1.8 && longitude > 29.9 && longitude < 30.2;

        if (isKigali) {
          setShippingLocation('Kigali');
          showToast(`📍 Location detected: Kigali (${latitude.toFixed(2)}, ${longitude.toFixed(2)}). 3 Hours delivery enabled!`);
        } else if (isRwanda) {
          setShippingLocation('Outside Kigali');
          showToast(`📍 Location detected: Rwanda Provinces (${latitude.toFixed(2)}, ${longitude.toFixed(2)}). 1 Day delivery enabled!`);
        } else {
          setShippingLocation('Outside Rwanda');
          showToast(`📍 Location detected: International (${latitude.toFixed(2)}, ${longitude.toFixed(2)}). 2 Weeks delivery enabled!`);
        }
      },
      (error) => {
        setLocationPromptOpen(false);
        showToast('⚠️ Location access declined. Please set your delivery zone manually in the cart.');
      }
    );
  };

  const exchangeRates = {
    USD: 1.0,
    RWF: 1320.0,
    ETH: 0.00030,
    EUR: 0.92,
    GBP: 0.78
  };

  const getConvertedResult = () => {
    const amt = parseFloat(converterAmount);
    if (isNaN(amt) || amt <= 0) return '0.00';
    const inUsd = amt / exchangeRates[fromCurrency];
    const result = inUsd * exchangeRates[toCurrency];
    if (toCurrency === 'ETH') return result.toFixed(5);
    if (toCurrency === 'RWF') return Math.round(result).toLocaleString();
    return result.toFixed(2);
  };

  const convertedResult = getConvertedResult();

  const cartSubtotalUsd = cart.reduce((sum, item) => sum + ((item.priceEth * 3300) * item.quantity), 0);
  const cartSubtotalRwf = Math.round(cartSubtotalUsd * 1320);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsSubscribed(true);
    showToast(`Subscribed: ${emailInput} registered for newsletter!`);
    setEmailInput('');
  };

  // Cart math
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.priceEth * item.quantity), 0);
  const estGasEth = 0.0015; // Mock gas cost
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + estGasEth : 0;

  const categories = [
    'All',
    "Men's Shoes",
    "Men's Clothes",
    "Men's Styles",
    "Rwandan Culture",
    'Made in Rwanda',
    'Electrical Materials'
  ];

  // Favorite / Best Selling Products (derived from live products list for consistency)
  const favoriteProductIds = ['1', '2', '5', '8'];
  const favoriteProducts = products.filter(p => favoriteProductIds.includes(p.id));

  // Filtering logic
  const filteredProducts = products.filter((prod) => {
    // Category match
    let categoryMatch = false;
    if (selectedCategory === 'All') {
      categoryMatch = true;
    } else if (selectedCategory === 'Made in Rwanda') {
      categoryMatch = prod.isMadeInRwanda === true;
    } else if (selectedCategory === 'Electrical Materials') {
      categoryMatch = prod.isElectrical === true;
    } else {
      categoryMatch = prod.category === selectedCategory;
    }

    // Search query match
    const query = searchQuery.toLowerCase();
    const nameMatch = prod.name.toLowerCase().includes(query);
    const descMatch = prod.description.toLowerCase().includes(query);
    const catMatch = prod.category.toLowerCase().includes(query);

    return categoryMatch && (nameMatch || descMatch || catMatch);
  });

  return (
    <div className="container">
      {/* Location Auto-Detection Prompt */}
      {locationPromptOpen && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fde68a',
          color: '#92400e',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          marginTop: '15px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '0.88rem',
          fontFamily: "'Outfit', 'Inter', sans-serif",
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          animation: 'smsSlideIn 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>📍</span>
            <div style={{ textAlign: 'left' }}>
              <strong style={{ fontWeight: '700' }}>Enable Device Location:</strong> To determine your shipping speed automatically (3 Hours within Kigali, 1 Day national, 2 Weeks international), please share your location.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={requestDeviceLocation}
              style={{
                backgroundColor: '#d97706',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b45309'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#d97706'; }}
            >
              Share Location
            </button>
            <button
              onClick={() => setLocationPromptOpen(false)}
              style={{
                backgroundColor: 'transparent',
                color: '#92400e',
                border: '1px solid #f59e0b',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner Section */}
      <section className="hero">
        <div className="hero-grid">
          <div>
            <span className="hero-tag">Decentralized Retail 3.0</span>
            <h1 className="hero-title">
              Discover Premium Styles on the <span>Blockchain</span>
            </h1>
            <p className="hero-desc">
              Shop authentic Men's Apparel, local <strong>Made in Rwanda</strong> crafts, and certified 
              electrical materials. Connect your wallet, authorize gas-efficient checkouts, and verify 
              receipt hashes on-chain.
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <h3>0%</h3>
                <p>Card Fees</p>
              </div>
              <div className="stat-item">
                <h3>100%</h3>
                <p>Decentralized</p>
              </div>
              <div className="stat-item">
                <h3>🇷🇼</h3>
                <p>Local Sourced</p>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="glowing-orbit">
              <div className="web3-token-display">
                <div style={{ fontSize: '2.5rem' }}>🇷🇼</div>
                <div style={{ fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
                  RWF Token
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Smart Contract Audited
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Men's Shoes and Styles Showcase Image Slider */}
      <div style={{ marginTop: '40px' }}>
        <ProductSlider />
      </div>

      {/* Category Tab Bar and Search Bar */}
      <div className="category-bar">
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-box">
          <Search size={18} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search items, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Made In Rwanda spotlight banner (conditional display) */}
      {(selectedCategory === 'Made in Rwanda' || selectedCategory === 'All') && (
        <div className="rwanda-showcase">
          <div>
            <div className="rwanda-showcase-title">
              <span style={{ fontSize: '2rem' }}>🇷🇼</span>
              <div style={{ fontWeight: '700' }}>
                Made in Rwanda Collective
                <div className="flag-strip">
                  <div className="flag-blue"></div>
                  <div className="flag-yellow"></div>
                  <div className="flag-green"></div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '640px' }}>
              Supporting the local manufacturing ecosystem. Discover luxury clothing items woven from local natural fibers, 
              durable footwear constructed from hand-finished hide, and essential infrastructure materials manufactured inside Rwanda.
            </p>
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', backgroundColor: 'white', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid #91d5ff' }}>
            🌾 Eco-Friendly & Sustainable
          </div>
        </div>
      )}

      {/* Split Layout: Catalog Grid (Left) and Favorite Products (Right) */}
      <div className="storefront-split">
        {/* Left Side: Product Grid */}
        <div className="catalog-main">
          {filteredProducts.length > 0 ? (
            <>
              <div className="product-grid">
                {filteredProducts.slice(0, visibleProducts).map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onOpenDetails={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
              
              {/* Pagination See More Button */}
              {filteredProducts.length > visibleProducts && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', marginBottom: '20px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setVisibleProducts((prev) => prev + 6)}
                    style={{ padding: '10px 24px', fontWeight: '700' }}
                  >
                    See More Products
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <h3>No assets match your search</h3>
              <p style={{ marginTop: '8px' }}>Try switching categories or clearing search keywords.</p>
              {searchQuery && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setSearchQuery('')}
                  style={{ marginTop: '16px' }}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Favorite Products Sold (Sidebar) */}
        <aside className="favorites-sidebar">
          <h2 className="favorites-sidebar-title">
            <Award size={18} color="var(--accent)" />
            <span>Favorite Products Sold</span>
          </h2>
          
          <div className="favorites-list">
            {favoriteProducts.length > 0 ? (
              favoriteProducts.map((prod) => (
                <div key={prod.id} className="favorite-card">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="favorite-card-img"
                    onClick={() => setSelectedProduct(prod)}
                  />
                  <div className="favorite-card-info">
                    <span className="favorite-badge">Best Seller 🔥</span>
                    <div
                      className="favorite-card-name"
                      onClick={() => setSelectedProduct(prod)}
                    >
                      {prod.name}
                    </div>
                    <div className="favorite-card-price" style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '700' }}>
                      ${(prod.priceEth * 3300).toFixed(2)} / {Math.round(prod.priceEth * 3300 * 1320).toLocaleString()} FRw
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                No favorites featured.
              </p>
            )}
          </div>

          {/* Simple Currency Converter Widget */}
          <div style={{
            marginTop: '28px',
            borderTop: '1px dashed var(--border-color)',
            paddingTop: '20px'
          }}>
            <h3 style={{
              fontSize: '0.92rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--text-primary)',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.1rem' }}>💱</span>
              <span>Price Currency Converter</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Amount</label>
                <input
                  type="number"
                  value={converterAmount}
                  onChange={(e) => setConverterAmount(e.target.value)}
                  className="form-control"
                  style={{ padding: '6px 10px', fontSize: '0.8rem', height: '32px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)' }}>From</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="form-control"
                    style={{ padding: '4px 8px', fontSize: '0.78rem', height: '32px' }}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="RWF">RWF (FRw)</option>
                    <option value="ETH">ETH (Ξ)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)' }}>To</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="form-control"
                    style={{ padding: '4px 8px', fontSize: '0.78rem', height: '32px' }}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="RWF">RWF (FRw)</option>
                    <option value="ETH">ETH (Ξ)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div style={{
                marginTop: '6px',
                padding: '10px',
                backgroundColor: 'var(--accent-light)',
                border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
                fontWeight: '700',
                color: '#166534',
                fontSize: '0.85rem'
              }}>
                {converterAmount || 0} {fromCurrency} = {convertedResult} {toCurrency}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Slide-out Cart Sidebar Drawer */}
      {isCartOpen && (
        <div className="modal-backdrop" onClick={() => setIsCartOpen(false)}>
          <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={20} className="logo-accent" />
                <span>Crypto Shopping Bag</span>
              </h2>
              <button className="btn-icon" onClick={() => setIsCartOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="cart-items">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div>
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-qty">
                        <button
                          className="qty-btn"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-price">
                      <div className="eth">{(item.priceEth * item.quantity).toFixed(3)} ETH</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        ≈ ${(item.priceEth * item.quantity * 3300).toFixed(2)} USD
                      </div>
                      <button
                        className="btn-icon"
                        onClick={() => removeFromCart(item.id)}
                        style={{ marginTop: '6px', color: 'var(--danger)' }}
                        title="Remove Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                  <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
                  <p>Your crypto bag is currently empty.</p>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-totals">
                  <div className="cart-total-row">
                    <span>Subtotal</span>
                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span>${cartSubtotalUsd.toFixed(2)}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                        {cartSubtotalRwf.toLocaleString()} FRw
                      </span>
                    </span>
                  </div>
                  
                  {cartPaymentMethod === 'crypto' && (
                    <div className="cart-total-row">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Gas Fee (Est.)
                      </span>
                      <span>{estGasEth} ETH</span>
                    </div>
                  )}

                  <div className="cart-total-row grand">
                    <span>Total Cost</span>
                    <span className="eth" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      {cartPaymentMethod === 'crypto' ? (
                        <>
                          <span>{(cartSubtotal + estGasEth).toFixed(4)} ETH</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                            ≈ ${( (cartSubtotal + estGasEth) * 3300 ).toFixed(2)} USD
                          </span>
                        </>
                      ) : (
                        <>
                          <span>${cartSubtotalUsd.toFixed(2)} USD</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                            ≈ {cartSubtotalRwf.toLocaleString()} FRw
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Delivery Location Selector */}
                <div style={{
                  marginBottom: '16px',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '16px'
                }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px' }}>
                    Delivery Destination
                  </div>
                  <select
                    value={shippingLocation}
                    onChange={(e) => setShippingLocation(e.target.value)}
                    className="form-control"
                    style={{ padding: '8px 12px', fontSize: '0.82rem', height: '36px' }}
                  >
                    <option value="Kigali">Within Kigali (Delivery: 3 Hours)</option>
                    <option value="Outside Kigali">Outside Kigali (Delivery: 1 Day)</option>
                    <option value="Outside Rwanda">Outside Rwanda (Delivery: 2 Weeks)</option>
                  </select>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: '700', marginTop: '6px' }}>
                    🚚 Est. Delivery: {shippingLocation === 'Kigali' ? '3 Hours (Kigali Express)' : shippingLocation === 'Outside Kigali' ? '1 Day (Standard Carrier)' : '2 Weeks (International Cargo)'}
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div style={{
                  marginBottom: '16px',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '16px'
                }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px' }}>
                    Choose Payment Channel
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="cartPaymentMethod"
                        checked={cartPaymentMethod === 'crypto'}
                        onChange={() => setCartPaymentMethod('crypto')}
                        style={{ accentColor: 'var(--accent)' }}
                      />
                      <span>Crypto Wallet</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="cartPaymentMethod"
                        checked={cartPaymentMethod === 'momo'}
                        onChange={() => setCartPaymentMethod('momo')}
                        style={{ accentColor: 'var(--accent)' }}
                      />
                      <span>MTN Momo</span>
                    </label>
                  </div>

                  {cartPaymentMethod === 'momo' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* Sub-method Toggles */}
                      <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
                        <button
                          type="button"
                          onClick={() => setMomoSubMethod('push')}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            fontSize: '0.78rem',
                            border: 'none',
                            backgroundColor: momoSubMethod === 'push' ? '#ffffff' : 'transparent',
                            color: momoSubMethod === 'push' ? '#111827' : 'var(--text-secondary)',
                            fontWeight: '700',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                          }}
                        >
                          USSD Push Request
                        </button>
                        <button
                          type="button"
                          onClick={() => setMomoSubMethod('qr')}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            fontSize: '0.78rem',
                            border: 'none',
                            backgroundColor: momoSubMethod === 'qr' ? '#ffffff' : 'transparent',
                            color: momoSubMethod === 'qr' ? '#111827' : 'var(--text-secondary)',
                            fontWeight: '700',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                          }}
                        >
                          Scan QR Code
                        </button>
                      </div>

                      {momoSubMethod === 'push' ? (
                        <div style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          padding: '12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.82rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}>
                          <div>
                            Merchant MTN Momo Number: <strong style={{ color: 'var(--accent)' }}>+250782148861</strong>
                          </div>
                          <div className="form-group" style={{ margin: '0' }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Your Subscriber Phone Number</label>
                            <input
                              type="text"
                              value={clientMomoNumber}
                              onChange={(e) => setClientMomoNumber(e.target.value)}
                              placeholder="e.g. +250780000000"
                              className="form-control"
                              style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          backgroundColor: '#ffffff',
                          padding: '16px',
                          borderRadius: 'var(--radius-sm)',
                          border: '2px solid #fcca03',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '12px',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#111827' }}>
                            MTN MoMo Pay QR Code
                          </div>
                          
                          {/* Vector QR Code with MTN Logo Center */}
                          <svg width="130" height="130" viewBox="0 0 100 100" style={{ border: '1px solid #e5e7eb', padding: '6px', borderRadius: '6px', backgroundColor: 'white' }}>
                            <rect x="5" y="5" width="25" height="25" fill="#111827" />
                            <rect x="9" y="9" width="17" height="17" fill="white" />
                            <rect x="13" y="13" width="9" height="9" fill="#fcca03" />

                            <rect x="70" y="5" width="25" height="25" fill="#111827" />
                            <rect x="74" y="9" width="17" height="17" fill="white" />
                            <rect x="78" y="13" width="9" height="9" fill="#fcca03" />

                            <rect x="5" y="70" width="25" height="25" fill="#111827" />
                            <rect x="9" y="74" width="17" height="17" fill="white" />
                            <rect x="13" y="78" width="9" height="9" fill="#fcca03" />

                            <rect x="35" y="5" width="10" height="10" fill="#111827" />
                            <rect x="50" y="15" width="15" height="5" fill="#111827" />
                            <rect x="35" y="20" width="5" height="15" fill="#111827" />
                            <rect x="45" y="25" width="10" height="10" fill="#fcca03" />
                            
                            <rect x="75" y="35" width="15" height="5" fill="#111827" />
                            <rect x="80" y="45" width="10" height="15" fill="#111827" />
                            <rect x="70" y="65" width="5" height="5" fill="#111827" />

                            <rect x="5" y="35" width="15" height="10" fill="#111827" />
                            <rect x="25" y="45" width="5" height="15" fill="#111827" />
                            <rect x="15" y="60" width="10" height="5" fill="#fcca03" />

                            <rect x="35" y="70" width="15" height="5" fill="#111827" />
                            <rect x="40" y="80" width="20" height="10" fill="#111827" />
                            <rect x="55" y="65" width="10" height="10" fill="#111827" />

                            {/* Center MTN MoMo badge */}
                            <rect x="38" y="38" width="24" height="24" rx="4" fill="#fcca03" stroke="#ffffff" strokeWidth="1.5" />
                            <text x="50" y="50" fill="#000000" fontSize="7" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">momo</text>
                          </svg>

                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Scan to pay merchant: <strong>Epa</strong><br/>
                            MoMo Number: <strong style={{ color: 'var(--accent)' }}>+250782148861</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {cartPaymentMethod === 'crypto' ? (
                  <>
                    <div className="gas-indicator">
                      <Zap size={14} color="var(--warning)" />
                      <span>Rwanda Devnet Gas Price: ~24 Gwei (Low Congestion)</span>
                    </div>

                    {walletConnected && walletBalance < cartTotal && (
                      <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '12px', fontWeight: '600' }}>
                        ⚠️ Insufficient balance in wallet (Available: {walletBalance} ETH)
                      </p>
                    )}

                    <button
                      className="btn btn-primary"
                      onClick={() => checkoutWithCrypto(shippingLocation, deviceCoords)}
                      disabled={walletConnected && walletBalance < cartTotal}
                      style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
                    >
                      <span>Authorize Blockchain Payment</span>
                      <ArrowRight size={16} />
                    </button>
                  </>
                ) : momoSubMethod === 'push' ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => checkoutWithMomo(clientMomoNumber, shippingLocation, deviceCoords)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      justifyContent: 'center',
                      backgroundColor: '#fcca03',
                      borderColor: '#fcca03',
                      color: '#111'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e0b200'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fcca03'; }}
                  >
                    <span>Send MTN Momo Pay Request</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => checkoutWithMomo('+250782148861', shippingLocation, deviceCoords)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      justifyContent: 'center',
                      backgroundColor: '#fcca03',
                      borderColor: '#fcca03',
                      color: '#111'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e0b200'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fcca03'; }}
                  >
                    <span>I Have Scanned and Paid</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Email Subscription & Social Channels Section */}
      <section className="subscribe-section">
        <div className="subscribe-text">
          <h2 className="subscribe-title">Stay Connected</h2>
          <p className="subscribe-desc">
            Subscribe to our newsletter for exclusive Web3 drops, brand collaborations, and updates on local Made in Rwanda materials.
          </p>
          
          {/* Social Media Link Icons */}
          <div className="social-links">
            <a href="https://twitter.com/kigalimart" target="_blank" rel="noreferrer" className="social-icon" title="Twitter / X">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            </a>
            <a href="https://discord.gg/kigalimart" target="_blank" rel="noreferrer" className="social-icon" title="Discord Guild">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 10a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                <path d="M13 10a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                <path d="M7.5 7.5c3 0 6 0 9 0c.5 1.5 1.5 3 2.5 4.5c.5 1.5 -1.5 2.5 -2.5 3c-1.5 .5 -4 .5 -5.5 .5c-1.5 0 -4 0 -5.5 -.5c-1 -1 -3 -1.5 -2.5 -3c1 -1.5 2 -3 2.5 -4.5z" />
                <path d="M9 16c1 .5 2 .5 3 .5s2 0 3 -.5" />
              </svg>
            </a>
            <a href="https://t.me/kigalimart" target="_blank" rel="noreferrer" className="social-icon" title="Telegram Channel">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
              </svg>
            </a>
            <a href="https://github.com/kigalimart" target="_blank" rel="noreferrer" className="social-icon" title="GitHub Source">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
          </div>
        </div>

        {/* Subscription Form */}
        <form onSubmit={handleSubscribe} className="subscribe-form">
          <input
            type="email"
            placeholder="Enter your client email address..."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            disabled={isSubscribed}
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubscribed}
            style={{ minWidth: '120px' }}
          >
            {isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
          </button>
        </form>
      </section>

      {/* Details Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
