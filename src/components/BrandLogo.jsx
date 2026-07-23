import React, { useState } from 'react';

export default function BrandLogo({ height = 44, showSubtitle = true }) {
  const [imageError, setImageError] = useState(false);

  // If the PNG has been copied to the public folder, load it directly
  if (!imageError) {
    return (
      <img
        src="/logo.png"
        alt="Epa & Eva E2 Online Shop Rwanda"
        style={{
          height: `${height}px`,
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
        onError={() => setImageError(true)}
      />
    );
  }

  // Elegant vector fallback representing "Epa & Eva E2 Online Shop Rwanda" in Gold & Black
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      lineHeight: '1.1',
      userSelect: 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Crown Flourish SVG */}
        <svg width="22" height="16" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2.5L14.8 7.5L20.2 8L16.2 11.5L17.5 16.5L12 13.8L6.5 16.5L7.8 11.5L3.8 8L9.2 7.5L12 2.5Z"
            fill="#d4af37"
            stroke="#d4af37"
            strokeWidth="0.5"
          />
          <circle cx="12" cy="1.2" r="1.2" fill="#d4af37" />
          <circle cx="3.2" cy="7.5" r="1" fill="#d4af37" />
          <circle cx="20.8" cy="7.5" r="1" fill="#d4af37" />
          <path d="M2 17.5H22" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span style={{
          color: '#d4af37',
          fontWeight: '800',
          fontSize: '1.1rem',
          letterSpacing: '0.8px',
          textTransform: 'uppercase'
        }}>
          Epa & Eva <span style={{ color: '#ff6600' }}>E2</span>
        </span>
      </div>
      {showSubtitle && (
        <span style={{
          color: '#d4af37',
          fontSize: '0.58rem',
          letterSpacing: '1px',
          fontWeight: '700',
          textTransform: 'uppercase',
          marginTop: '2px',
          opacity: '0.9'
        }}>
          Modern Style A Click Away
        </span>
      )}
    </div>
  );
}
