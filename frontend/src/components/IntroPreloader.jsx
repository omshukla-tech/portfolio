import React, { useState, useEffect } from 'react';

export default function IntroPreloader({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);
  const [phase, setPhase] = useState(1); // 1 = Handshake, 2 = Typographic Morph

  useEffect(() => {
    // If intro has already been seen in this session, skip mounting
    const seen = sessionStorage.getItem('introSeen');
    if (seen === 'true') {
      onComplete();
      return;
    }

    // Lock page scroll during preloader run
    document.body.style.overflow = 'hidden';

    // Transition: Phase 1 -> Phase 2 at 1.0s
    const morphTimer = setTimeout(() => {
      setPhase(2);
    }, 1000);

    // Transition: Phase 2 -> Exit Transition at 2.2s
    const exitTimer = setTimeout(() => {
      handleExit();
    }, 2200);

    return () => {
      clearTimeout(morphTimer);
      clearTimeout(exitTimer);
      document.body.style.overflow = '';
    };
  }, []);

  const handleExit = () => {
    if (isExiting) return;
    setIsExiting(true);
    sessionStorage.setItem('introSeen', 'true');
    
    // Allow the 300ms slide-up transition to finish before completing
    setTimeout(() => {
      document.body.style.overflow = '';
      onComplete();
    }, 300);
  };

  const handleSkip = () => {
    handleExit();
  };

  const seen = sessionStorage.getItem('introSeen');
  if (seen === 'true') return null;

  return (
    <div className={`intro-preloader ${isExiting ? 'exit-active' : ''}`} aria-live="polite">
      {/* Skip Intro Button */}
      <button 
        className="intro-skip-btn" 
        onClick={handleSkip}
        aria-label="Skip cinematic introduction"
      >
        Skip Intro
      </button>

      <div className="intro-content">
        {phase === 1 ? (
          <div className="terminal-handshake" aria-label="Terminal connection handshake">
            <div className="binary-column col-1">01101001 01101110 01110100 01100101 01110010 01101110</div>
            <div className="binary-column col-2">01110011 01100101 01100011 01110101 01110010 01100101</div>
            <div className="binary-column col-3">01100110 01101100 01100001 01110011 01101011 00110010</div>
            <div className="binary-column col-4">01110000 01101111 01110011 01110100 01100111 01110010</div>
            <div className="binary-column col-5">01100001 01110101 01110100 01101000 01100101 01101110</div>
            <div className="binary-status">[ CONNECTING TO SECURITY SOCKETS... ]</div>
          </div>
        ) : (
          <div className="typographic-morph">
            <h1 className="morph-text">OM SHUKLA</h1>
            <p className="morph-sub">Full Stack Backend Developer</p>
          </div>
        )}
      </div>
    </div>
  );
}
