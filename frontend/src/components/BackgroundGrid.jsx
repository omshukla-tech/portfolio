import React, { useEffect, useRef } from 'react';

// Palette of premium, dark-mode friendly colors (RGB values)
const colorPalette = [
  [14, 165, 233],  // Deep Sky Blue (0% Scroll)
  [142, 68, 237], // Royal Violet (33% Scroll)
  [20, 184, 166],  // Sleek Teal (66% Scroll)
  [16, 185, 129]  // Emerald Green (100% Scroll)
];

const interpolateColor = (color1, color2, factor) => {
  const r = Math.round(color1[0] + factor * (color2[0] - color1[0]));
  const g = Math.round(color1[1] + factor * (color2[1] - color1[1]));
  const b = Math.round(color1[2] + factor * (color2[2] - color1[2]));
  return `rgb(${r}, ${g}, ${b})`;
};

const getInterpolatedColorForScroll = (pct) => {
  const clamped = Math.max(0, Math.min(1, pct));
  const numColors = colorPalette.length;
  const scaledPct = clamped * (numColors - 1);
  const index = Math.floor(scaledPct);
  const fraction = scaledPct - index;
  
  if (index >= numColors - 1) {
    const [r, g, b] = colorPalette[numColors - 1];
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  const color1 = colorPalette[index];
  const color2 = colorPalette[index + 1];
  return interpolateColor(color1, color2, fraction);
};

export default function BackgroundGrid() {
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Mouse Move Listener (Instant Tracking)
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      containerRef.current.style.setProperty('--mouse-x', `${x}px`);
      containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    // 2. Scroll Listener (Throttled via requestAnimationFrame)
    let ticking = false;

    const updateGlowColor = () => {
      if (!containerRef.current) {
        ticking = false;
        return;
      }
      
      const scrollTop = window.scrollY;
      
      // Update scroll variable for parallax translation
      containerRef.current.style.setProperty('--scroll-top', `${scrollTop}`);
      
      // Glow color interpolation based on scroll pct
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      
      const baseRgb = getInterpolatedColorForScroll(pct);
      
      // Map to CSS custom variables (Core and Mid gradients)
      const coreColor = baseRgb.replace('rgb', 'rgba').replace(')', ', 0.28)');
      const midColor = baseRgb.replace('rgb', 'rgba').replace(')', ', 0.05)');
      
      containerRef.current.style.setProperty('--glow-color', coreColor);
      containerRef.current.style.setProperty('--glow-color-mid', midColor);
      
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateGlowColor);
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Run initial calls to establish baseline
    if (containerRef.current) {
      containerRef.current.style.setProperty('--mouse-x', '50vw');
      containerRef.current.style.setProperty('--mouse-y', '30vh');
      containerRef.current.style.setProperty('--scroll-top', '0');
    }
    updateGlowColor();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="background-wrapper" aria-hidden="true">
      {/* Single Dynamic Color Glow Layer (Sits on layer 1, behind the grid) */}
      <div className="mouse-glow-overlay">
        <div className="mouse-glow-spotlight" />
      </div>
      
      {/* Background Grid Pattern (Sits on layer 2, above the glow, parallax displaced) */}
      <div className="background-grid" />
    </div>
  );
}
