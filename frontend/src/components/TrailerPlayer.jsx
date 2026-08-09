import React, { useEffect, useState } from 'react';
import styles from './TrailerPlayer.module.css';

const TrailerPlayer = ({ title, trailerKey, poster, onClose, autoPlay = true }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

  // Handle iframe loading
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    // Reload iframe by remounting
    const iframe = document.getElementById('trailer-iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

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
        <button className={styles.closeBtn} onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className={styles.trailerContainer}>
          <div className={styles.trailerWrapper}>
            {/* Loading Overlay */}
            {isLoading && (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading trailer...</p>
              </div>
            )}
            
            {/* Error Overlay */}
            {hasError && (
              <div className={styles.errorContainer}>
                <i className="fas fa-exclamation-triangle"></i>
                <h3>Failed to Load</h3>
                <p>Could not load the trailer. Please try again.</p>
                <button 
                  className={styles.closeBtnSmall} 
                  onClick={handleRetry}
                >
                  Retry
                </button>
              </div>
            )}
            
            <iframe
              id="trailer-iframe"
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1&showinfo=0&controls=1&loop=0&iv_load_policy=3`}
              title={`${title} - Official Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                zIndex: 2,
                opacity: isLoading || hasError ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }}
            />
          </div>
          
          <div className={styles.trailerInfo}>
            <div className={styles.trailerTitle}>
              <i className="fas fa-play-circle"></i>
              <h3>
                {title} <span>• Official Trailer</span>
              </h3>
            </div>
            <div className={styles.trailerMeta}>
              <span className={styles.quality}>HD</span>
              <span>YouTube</span>
            </div>
          </div>
        </div>
        
        <div className={styles.shortcutHint}>
          Press ESC to close
        </div>
      </div>
    </div>
  );
};

export default TrailerPlayer;