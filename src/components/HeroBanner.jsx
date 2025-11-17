import React, { useState, useEffect, useRef } from 'react';
import styles from './HeroBanner.module.css';

// The texts for typing animation
const TEXTS_TO_TYPE = [
  "Cinematic Experience",
  "Movie Discovery",
  "TV Show Paradise",
  "Entertainment Hub"
];

export default function HeroBanner() {
  const [typedText, setTypedText] = useState('');

  const textIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const typingSpeed = useRef(100);

  useEffect(() => {
    const type = () => {
      const currentText = TEXTS_TO_TYPE[textIndex.current];

      if (isDeleting.current) {
        setTypedText(currentText.substring(0, charIndex.current - 1));
        charIndex.current--;
        typingSpeed.current = 50;
      } else {
        setTypedText(currentText.substring(0, charIndex.current + 1));
        charIndex.current++;
        typingSpeed.current = 100;
      }

      if (!isDeleting.current && charIndex.current === currentText.length) {
        typingSpeed.current = 2000;
        isDeleting.current = true;
      } else if (isDeleting.current && charIndex.current === 0) {
        isDeleting.current = false;
        textIndex.current = (textIndex.current + 1) % TEXTS_TO_TYPE.length;
        typingSpeed.current = 500;
      }

      setTimeout(type, typingSpeed.current);
    };

    const timeoutId = setTimeout(type, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroContent}>
          
          {/* LEFT TEXT */}
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Discover Your Next <br />Favourite Movie
            </h1>

            <div className={styles.typingContainer}>
              <span className={styles.typeText}>{typedText}</span>
              <span className={styles.cursor}>|</span>
            </div>

            <p className={styles.heroDescription}>
              Explore thousands of movies and TV shows with MovieMate. Find hidden gems,
              trending content, and personalized recommendations all in one place.
            </p>

            <div className={styles.heroActions}>
              <button className={`${styles.heroBtn} ${styles.playBtn}`}>
                <i className="fas fa-play"></i>
                Explore Movies
              </button>

              <button className={`${styles.heroBtn} ${styles.infoBtn}`}>
                <i className="fas fa-info-circle"></i>
                Learn More
              </button>
            </div>
          </div>

          {/* RIGHT SIDE — VIDEO ICON */}
          <div className={styles.heroVisual}>
            <div className={`${styles.heroPlaceholder} ${styles.floatingAnimation}`}>
              <i className={`fa-solid fa-video ${styles.playIcon}`}></i>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
