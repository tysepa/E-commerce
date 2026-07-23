import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const SLIDE_DATA = [
  {
    id: 1,
    title: "Heart of Men's Footwear",
    subtitle: "Rwandan Agaseke Leather Brogues & Boots",
    description: "Minted on-chain, hand-stitched locally in Kigali. Explore our collection of premium local leather shoes designed for absolute comfort and styling.",
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 2,
    title: "Men's Cultural Styles",
    subtitle: "Traditional Umushanana & Vests",
    description: "Dignity meets modern style. Discover the handcrafted vests and ceremonial attire worn by the modern Rwandan gentleman, woven with sustainable sisal trims.",
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 3,
    title: "Contemporary Men's Apparel",
    subtitle: "Indigo Shirts & Woven Linens",
    description: "Bespoke casual shirts dyed with organic indigo by Kigali artisans. Lightweight, breathable, and designed for high-contrast seasonal styling.",
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=600'
    ]
  }
];

export default function ProductSlider() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIdx]);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % SLIDE_DATA.length);
    setActiveImageIdx(0); // Reset secondary photo select on slide change
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + SLIDE_DATA.length) % SLIDE_DATA.length);
    setActiveImageIdx(0);
  };

  const currentSlide = SLIDE_DATA[currentIdx];

  return (
    <div className="slider-container">
      {/* Slide Text Content Side */}
      <div className="slider-text-side">
        <span className="slider-badge">
          <Sparkles size={12} />
          <span>Trending Men's Showcase</span>
        </span>
        <h2 className="slider-title">{currentSlide.title}</h2>
        <h3 className="slider-subtitle">{currentSlide.subtitle}</h3>
        <p className="slider-desc">{currentSlide.description}</p>
        
        {/* Navigation Arrows */}
        <div className="slider-nav-btns">
          <button className="slider-nav-btn" onClick={handlePrev} title="Previous Slide">
            <ChevronLeft size={20} />
          </button>
          <button className="slider-nav-btn" onClick={handleNext} title="Next Slide">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="slider-indicators">
          {SLIDE_DATA.map((_, idx) => (
            <button
              key={idx}
              className={`slider-dot ${idx === currentIdx ? 'active' : ''}`}
              onClick={() => {
                setCurrentIdx(idx);
                setActiveImageIdx(0);
              }}
            />
          ))}
        </div>
      </div>

      {/* Slide Image Grid / Photo Roll Side */}
      <div className="slider-photos-side">
        {/* Large active photo */}
        <div className="slider-main-photo-wrapper">
          <img
            src={currentSlide.images[activeImageIdx]}
            alt={currentSlide.title}
            className="slider-main-photo"
          />
        </div>

        {/* Thumbnail rolls (many photos inside slide) */}
        <div className="slider-thumb-roll">
          {currentSlide.images.map((imgUrl, idx) => (
            <button
              key={idx}
              className={`slider-thumb-btn ${idx === activeImageIdx ? 'active' : ''}`}
              onClick={() => setActiveImageIdx(idx)}
            >
              <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="slider-thumb-img" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
