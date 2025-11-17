import React, { useState, useEffect, useRef } from 'react';
import styles from './HeroBanner.module.css';
import playButton from '../assets/video-camera.png';
// The texts to cycle through from your old JS
const TEXTS_TO_TYPE = [
  "Cinematic Experience",
  "Movie Discovery",
  "TV Show Paradise",
  "Entertainment Hub"
];

export default function HeroBanner() {
  const [typedText, setTypedText] = useState('');

  // We use 'refs' to store values that change but don't re-render the component
  const textIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const typingSpeed = useRef(100);

  // This is the React version of your 'initTypingAnimation'
  useEffect(() => {
    const type = () => {
      const currentText = TEXTS_TO_TYPE[textIndex.current];
      
      if (isDeleting.current) {
        // Deleting
        setTypedText(currentText.substring(0, charIndex.current - 1));
        charIndex.current--;
        typingSpeed.current = 50;
      } else {
        // Typing
        setTypedText(currentText.substring(0, charIndex.current + 1));
        charIndex.current++;
        typingSpeed.current = 100;
      }

      // Check if word is complete
      if (!isDeleting.current && charIndex.current === currentText.length) {
        typingSpeed.current = 2000; // Pause at end of word
        isDeleting.current = true;
      } 
      // Check if word is fully deleted
      else if (isDeleting.current && charIndex.current === 0) {
        isDeleting.current = false;
        textIndex.current = (textIndex.current + 1) % TEXTS_TO_TYPE.length;
        typingSpeed.current = 500; // Pause before next word
      }
      
      // Loop it
      setTimeout(type, typingSpeed.current);
    };

    // Start the typing animation after a short delay
    const timeoutId = setTimeout(type, 1000);
    
    // Cleanup function (this stops the loop if you leave the page)
    return () => clearTimeout(timeoutId);
  }, []); // Empty array [] means this runs only ONCE

  return (
    <section className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Discover Your Next <br />Favourite Movie
            </h1>
            
            <div className={styles.typingContainer}>
              <span className={styles.typeText}>{typedText}</span>
              <span className={styles.cursor}>|</span>
            </div>
            
            <p className={styles.heroDescription}>
              Explore thousands of movies and TV shows with MovieMate. Find hidden gems, trending content, and personalized recommendations all in one place.
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
          
          <div className={styles.heroVisual}>
            <div className={`${styles.heroPlaceholder} ${styles.floatingAnimation}`}>
              <img src={playButton} alt="Play Button" className={styles.playIcon} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}