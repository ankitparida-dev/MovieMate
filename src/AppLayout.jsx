import { useState, useEffect } from 'react';
import './AppLayout.css'; // <-- Import the "Boss" CSS

// This component renders the shared layout
export default function AppLayout({ 
  children, // This special prop is the page we want to show
  onShowHome, 
  onShowMovies, 
  onShowTvShows, 
  onShowLogin,
  currentPage // We need this to set the "active" link
}) {
  
  // --- Theme Toggle Logic ---
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    // This runs every time 'theme' state changes
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // --- Header Scroll Logic ---
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ===== 1. The Header ===== */}
      <header className={`main-header ${isScrolled ? 'scrolled' : ''}`} id="mainHeader">
        <div className="container">
          <nav className="navbar">
            <div className="left-section">
              <a href="#" onClick={onShowHome} className="logo">
                <video src="/movielight.mp4" alt="MovieMate logo" className="logo-animation" loop autoPlay muted></video>
              </a>
            </div>
            <ul className="middle-section">
              <li className="nav-item">
                <a href="#" onClick={onShowHome} className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}>Home</a>
              </li>
              <li className="nav-item">
                <a href="#" onClick={onShowMovies} className={`nav-link ${currentPage === 'movies' ? 'active' : ''}`}>Movies</a>
              </li>
              <li className="nav-item">
                <a href="#" onClick={onShowTvShows} className={`nav-link ${currentPage === 'tvShows' ? 'active' : ''}`}>TV Shows</a>
              </li>
            </ul>
            <div className="right-section">
              <div className="search-container">
                <i className="fas fa-search search-icon"></i>
                <input type="text" className="search-input" placeholder="Search..." />
              </div>
              <button className="theme-toggle" id="themeToggle" onClick={toggleTheme}>
                <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
              </button>
              <div className="login-button">
                <a href="#" onClick={onShowLogin} className="btn btn-outline login-link">
                  <i className="fas fa-user"></i> Login
                </a>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* ===== 2. The Page Content ===== */}
      {/* This renders the <LandingPage/>, <MoviesPage/>, etc. */}
      <main>
        {children}
      </main>

      {/* ===== 3. The Footer ===== */}
      <footer className="main-footer">
        <div className="container">
          {/* (Paste your full footer HTML/JSX here) */}
          <div className="footer-content">
             {/* ... all your footer sections ... */}
             <div className="footer-section">
               <h3 className="footer-title">MovieMate</h3>
               <p className="footer-description">
                 Your ultimate destination...
               </p>
               {/* ... etc ... */}
             </div>
             <div className="footer-section">
               <h3 className="footer-title">Quick Links</h3>
               {/* ... etc ... */}
             </div>
             <div className="footer-section">
               <h3 className="footer-title">Genres</h3>
               {/* ... etc ... */}
             </div>
          </div>
          <div className="footer-bottom">
            <div className="copyright">
              <p>&copy; 2025 MovieMate. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}