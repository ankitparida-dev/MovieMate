import React from 'react';
import styles from './Footer.module.css';
import tmdbLogo from '../assets/tmdb-logo.svg';

const Footer = ({ setPage }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          
          {/* Logo Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.logo}>🎬 MovieMate</h3>
            <p className={styles.description}>
              Your ultimate destination for discovering movies and TV shows. 
              Find ratings, reviews, and where to watch all in one place.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className={styles.socialLink} aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className={styles.socialLink} aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h3>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li><button onClick={() => setPage("home")}>🏠 Home</button></li>
              <li><button onClick={() => setPage("movies")}>🎬 Movies</button></li>
              <li><button onClick={() => setPage("tvshows")}>📺 TV Shows</button></li>
              <li><button onClick={() => setPage("library")}>📚 My Library</button></li>
            </ul>
          </div>

          {/* Explore Section */}
          <div className={styles.footerSection}>
            <h3>Explore</h3>
            <ul className={styles.footerLinks}>
              <li><button onClick={() => setPage("analytics")}>📊 Analytics</button></li>
              <li><button onClick={() => setPage("mynotes")}>✍️ My Notes</button></li>
              <li><button onClick={() => setPage("profile")}>👤 Profile</button></li>
              <li><button onClick={() => setPage("admin")}>👑 Admin Dashboard</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerSection}>
            <h3>Contact</h3>
            <ul className={styles.contactInfo}>
              <li>
                <i className="fas fa-envelope"></i>
                <span>support@moviemate.com</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>Movie City, CA 90210</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} MovieMate. All rights reserved.</p>

          <div className={styles.tmdbCredit}>
            <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
            {tmdbLogo && <img src={tmdbLogo} alt="The Movie Database" className={styles.tmdbLogo} />}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;