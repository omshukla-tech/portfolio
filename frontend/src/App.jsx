import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BackgroundGrid from './components/BackgroundGrid';
import IntroPreloader from './components/IntroPreloader';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    // Check if introduction was already watched in this session
    const seen = sessionStorage.getItem('introSeen');
    if (seen === 'true') {
      setIntroComplete(true);
    }
  }, []);

  return (
    <Router>
      {!introComplete && (
        <IntroPreloader onComplete={() => setIntroComplete(true)} />
      )}
      
      <div className={`app-container ${introComplete ? 'intro-complete' : 'intro-locked'}`}>
        <BackgroundGrid />
        <Header />
        <main style={{ minHeight: 'calc(100vh - 120px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
