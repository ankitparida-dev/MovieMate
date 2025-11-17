import React from 'react';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen({ progress }) {
  return (
    <div className={styles.loadingScreen}>
      <div className={styles.loadingContent}>
        <div className={styles.loadingLogo}>
          <div className={styles.logo}>
            <video
              src="/Media files/movielight.mp4" // From 'public' folder
              alt="MovieMate logo"
              className={styles.logoAnimation}
              loop
              autoPlay
              muted
            />
          </div>
        </div>
        <div className={styles.loadingAnimation}>
          <div className={styles.loadingTextContent}>
            <h2 className={styles.loadingText}>Welcome to MovieMate</h2>
            <p className={styles.loadingSubtext}>
              Loading your cinematic experience...
            </p>
          </div>
          <div className={styles.progressContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }} // <-- Progress bar updates via props
            />
          </div>
          <div className={styles.loadingStats}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>{progress}%</div> {/* <-- % updates via props */}
              <div className={styles.statLabel}>Loaded</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>Movies</div>
              <div className={styles.statLabel}>Ready</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>TV Shows</div>
              <div className={styles.statLabel}>Ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}