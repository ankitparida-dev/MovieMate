import React, { useState, useEffect } from 'react';
import styles from './TrailerPlayer.module.css';

const TrailerPlayer = ({ title, trailerKey, poster, onClose, autoPlay = true }) => {

  // Handle click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!trailerKey) {
    return (
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.modal}>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
          <div className={styles.errorContainer}>
            <i className="fas fa-video-slash"></i>
            <h3>No Trailer Available</h3>
            <p>Sorry, no trailer found for "{title}"</p>
            <button className={styles.closeBtnSmall} onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <div className={styles.trailerContainer}>
          <div className={styles.trailerWrapper}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </div>
          <div className={styles.trailerInfo}>
            <h3><i className="fas fa-play-circle"></i> {title}</h3>
            <p>Watch the official trailer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerPlayer;