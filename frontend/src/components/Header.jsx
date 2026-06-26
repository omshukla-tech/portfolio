import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light') {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      setIsDark(false);
    } else if (savedTheme === 'dark' || prefersDark) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleNavClick = (e, targetId) => {
    if (location.pathname !== '/') {
      // If we are on admin page, let the standard link redirect
      return;
    }
    
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 52;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className="header">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span>O</span>m Shukla
        </Link>

        {!isAdminRoute ? (
          <ul className="nav-menu">
            <li>
              <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="nav-link">
                Home
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="nav-link">
                About
              </a>
            </li>
            <li>
              <a href="#skills" onClick={(e) => handleNavClick(e, 'skills')} className="nav-link">
                Skills
              </a>
            </li>
            <li>
              <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="nav-link">
                Projects
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="nav-link">
                Contact
              </a>
            </li>
          </ul>
        ) : (
          <ul className="nav-menu">
            <li>
              <Link to="/" className="nav-link">
                Back to Site
              </Link>
            </li>
          </ul>
        )}

        <div className="nav-controls">
          <button 
            onClick={toggleTheme} 
            className="theme-btn" 
            aria-label="Toggle theme"
            title="Toggle Theme"
          >
            <i className={isDark ? "fas fa-sun" : "fas fa-moon"}></i>
          </button>
          
          <Link 
            to="/admin" 
            className="admin-btn" 
            aria-label="Admin Dashboard"
            title="Admin Dashboard"
          >
            <i className="fas fa-lock"></i>
          </Link>
        </div>
      </div>
    </header>
  );
}
