import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { X, Plus, Save } from 'lucide-react';

export default function AdminProductModal({ product, onClose }) {
  const { addProduct, updateProduct } = useWeb3();
  const [imageSource, setImageSource] = useState('url'); // 'url' | 'file'
  
  const [formData, setFormData] = useState({
    name: '',
    category: "Men's Clothes",
    priceEth: '',
    image: '',
    description: '',
    isMadeInRwanda: false,
    isElectrical: false
  });

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        category: product.category,
        priceEth: product.priceEth,
        image: product.image,
        description: product.description,
        isMadeInRwanda: product.isMadeInRwanda || false,
        isElectrical: product.isElectrical || false
      });
      if (product.image && product.image.startsWith('data:image/')) {
        setImageSource('file');
      } else {
        setImageSource('url');
      }
    } else {
      const randomImages = [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600'
      ];
      const randomPic = randomImages[Math.floor(Math.random() * randomImages.length)];
      setFormData({
        name: '',
        category: "Men's Clothes",
        priceEth: '',
        image: randomPic,
        description: '',
        isMadeInRwanda: false,
        isElectrical: false
      });
      setImageSource('url');
    }
  }, [product]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        image: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.priceEth || !formData.description) {
      alert('Please fill out all required fields.');
      return;
    }

    if (product) {
      updateProduct(formData);
    } else {
      addProduct(formData);
    }
    onClose();
  };

  const categories = [
    "Men's Shoes",
    "Men's Clothes",
    "Men's Styles",
    "Made in Rwanda",
    "Electrical Materials"
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <h2>{product ? 'Edit Product Item' : 'Register New Web3 Product'}</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            {/* Title / Name */}
            <div className="form-group">
              <label className="form-label">Product Title *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Kigali Custom Suede Loafers"
                className="form-control"
                required
              />
            </div>

            {/* Row: Category and Price */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-control"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price in ETH *</label>
                <input
                  type="number"
                  step="0.0001"
                  name="priceEth"
                  value={formData.priceEth}
                  onChange={handleChange}
                  placeholder="e.g. 0.03"
                  className="form-control"
                  required
                />
                {formData.priceEth && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '600' }}>
                    ≈ ${(formData.priceEth * 3300).toFixed(2)} / {Math.round(formData.priceEth * 3300 * 1320).toLocaleString()} FRw
                  </div>
                )}
              </div>
            </div>

            {/* Image Source and Input */}
            <div className="form-group">
              <label className="form-label">Product Image Source</label>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="imageSource"
                    checked={imageSource === 'url'}
                    onChange={() => setImageSource('url')}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <span>Provide Image URL</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="imageSource"
                    checked={imageSource === 'file'}
                    onChange={() => setImageSource('file')}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <span>Upload Local File</span>
                </label>
              </div>

              {imageSource === 'url' ? (
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="form-control"
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control"
                    style={{ padding: '6px' }}
                  />
                  {formData.image && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                      <img
                        src={formData.image}
                        alt="Preview"
                        style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Image loaded from device ✓</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Product Details / Description *</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write detailed specifications of materials, origins, or features..."
                className="form-control"
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            {/* Attribute Flags */}
            <div style={{ display: 'flex', gap: '24px', marginTop: '10px' }}>
              <label className="form-check">
                <input
                  type="checkbox"
                  name="isMadeInRwanda"
                  checked={formData.isMadeInRwanda}
                  onChange={handleChange}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>🇷🇼 Made In Rwanda</span>
              </label>

              <label className="form-check">
                <input
                  type="checkbox"
                  name="isElectrical"
                  checked={formData.isElectrical}
                  onChange={handleChange}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>⚡ Electrical Material</span>
              </label>
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>{product ? 'Save Changes' : 'Mint Product'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
