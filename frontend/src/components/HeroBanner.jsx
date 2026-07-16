import React, { useState, useEffect, useRef } from 'react';
import styles from './HeroBanner.module.css';
import TrailerPlayer from './TrailerPlayer';

// The texts for typing animation
const TEXTS_TO_TYPE = [
  "Cinematic Experience",
  "Movie Discovery",
  "TV Show Paradise",
  "Entertainment Hub",
  "Personalized Picks"
];

// Featured movies for carousel
const FEATURED_MOVIES = [
  {
    id: 27205,
    title: "Inception",
    poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/8ZTVqvKDQNemWeJyuMJiO9m4j3R.jpg",
    trailerKey: "YoHD9XEInc0",
    rating: 8.8,
    year: 2010
  },
  {
    id: 157336,
    title: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    trailerKey: "zSWdZVtXT7E",
    rating: 8.6,
    year: 2014
  },
  {
    id: 155,
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    trailerKey: "EXeTwQWrcwY",
    rating: 9.0,
    year: 2008
  },
  {
    id: 299534,
    title: "Avengers: Endgame",
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    trailerKey: "TcMBFSGVi1c",
    rating: 8.4,
    year: 2019
  },
  {
    id: 496243,
    title: "Parasite",
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
    trailerKey: "5xH0HfJHsaY",
    rating: 8.6,
    year: 2019
  }
];

export default function HeroBanner({ onExploreClick }) {
  const [typedText, setTypedText] = useState('');
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const textIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const typingSpeed = useRef(100);
  const carouselIntervalRef = useRef(null);

  // Typing animation
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

    const timeoutId = setTimeout(type, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  // ✅ Background movie carousel - PAUSED when trailer is open
  useEffect(() => {
    // Clear any existing interval
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
    }

    // ✅ Only start carousel if trailer is NOT showing
    if (!showTrailer) {
      carouselIntervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentMovieIndex((prev) => (prev + 1) % FEATURED_MOVIES.length);
          setIsTransitioning(false);
        }, 500);
      }, 5000);
    }

    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [showTrailer]); // ✅ Re-run when showTrailer changes

  const currentMovie = FEATURED_MOVIES[currentMovieIndex];

  const handleExploreClick = () => {
    if (onExploreClick) {
      onExploreClick();
    }
  };

  // ✅ Handle trailer open/close
  const handleOpenTrailer = () => {
    setShowTrailer(true);
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
  };

  return (
    <section className={styles.heroSection}>
      {/* Background Image with Overlay */}
      <div className={styles.backgroundContainer}>
        <div 
          className={`${styles.backgroundImage} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}
          style={{ backgroundImage: `url(${currentMovie.backdrop})` }}
        />
        <div className={styles.overlay}></div>
        <div className={styles.gradientOverlay}></div>
      </div>

      {/* Movie Cards Carousel in Background */}
      <div className={styles.carouselContainer}>
        {FEATURED_MOVIES.map((movie, index) => (
          <div
            key={movie.id}
            className={`${styles.movieCard} ${index === currentMovieIndex ? styles.active : ''}`}
            style={{
              transform: `translateX(${(index - currentMovieIndex) * 120}%) rotate(${(index - currentMovieIndex) * 5}deg)`,
              opacity: Math.abs(index - currentMovieIndex) <= 2 ? 1 : 0,
              zIndex: FEATURED_MOVIES.length - Math.abs(index - currentMovieIndex)
            }}
          >
            <img src={movie.poster} alt={movie.title} />
            <div className={styles.movieCardInfo}>
              <h4>{movie.title}</h4>
              <div className={styles.movieCardRating}>
                <i className="fas fa-star"></i>
                <span>{movie.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="container">
        <div className={styles.heroContent}>
          
          {/* LEFT TEXT */}
          <div className={styles.heroText}>
            <span className={styles.welcomeBadge}>
              <i className="fas fa-fire"></i> TRENDING NOW
            </span>
            
            <h1 className={styles.heroTitle}>
              Discover Your Next <br />
              <span className={styles.gradientText}>Favourite Movie</span>
            </h1>

            <div className={styles.typingContainer}>
              <span className={styles.typeLabel}>🎬</span>
              <span className={styles.typeText}>{typedText}</span>
              <span className={styles.cursor}>|</span>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>10K+</span>
                <span className={styles.statLabel}>Movies</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>2K+</span>
                <span className={styles.statLabel}>TV Shows</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statLabel}>Genres</span>
              </div>
            </div>

            <div className={styles.heroActions}>
              <button 
                className={`${styles.heroBtn} ${styles.playBtn}`}
                onClick={handleExploreClick}
              >
                <i className="fas fa-play"></i>
                Explore Movies
              </button>

              <button className={`${styles.heroBtn} ${styles.infoBtn}`}>
                <i className="fas fa-info-circle"></i>
                Learn More
              </button>
            </div>

            <div className={styles.trustBadges}>
              <span><i className="fas fa-database"></i> Powered by TMDB</span>
              <span><i className="fas fa-chart-line"></i> Real-time Updates</span>
              <span><i className="fas fa-shield-alt"></i> Free Access</span>
            </div>
          </div>

          {/* RIGHT SIDE - Current Movie Info */}
          <div className={styles.heroVisual}>
            <div className={styles.currentMovieCard}>
              <div 
                className={styles.currentMoviePoster}
                onClick={handleOpenTrailer}
                style={{ cursor: 'pointer' }}
              >
                <img src={currentMovie.poster} alt={currentMovie.title} />
                <div className={styles.currentMovieBadge}>
                  <span>#{currentMovieIndex + 1} Featured</span>
                </div>
                <div className={styles.playOverlay}>
                  <div className={styles.playIconContainer}>
                    <i className="fas fa-play"></i>
                    <span>Watch Trailer</span>
                  </div>
                </div>
              </div>
              <div className={styles.currentMovieInfo}>
                <h3>{currentMovie.title}</h3>
                <div className={styles.currentMovieMeta}>
                  <span>{currentMovie.year}</span>
                  <span className={styles.rating}>
                    <i className="fas fa-star"></i> {currentMovie.rating}/10
                  </span>
                </div>
                <div className={styles.currentMovieActions}>
                  <button 
                    className={styles.watchNowBtn}
                    onClick={handleOpenTrailer}
                  >
                    <i className="fas fa-play"></i> Watch Trailer
                  </button>
                  <button className={styles.addToListBtn}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Carousel Indicators */}
      <div className={styles.carouselIndicators}>
        {FEATURED_MOVIES.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentMovieIndex ? styles.active : ''}`}
            onClick={() => {
              // Don't switch if trailer is open
              if (!showTrailer) {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentMovieIndex(index);
                  setIsTransitioning(false);
                }, 300);
              }
            }}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <span>Scroll to explore</span>
        <i className="fas fa-chevron-down"></i>
      </div>

      {/* ✅ TRAILER PLAYER - Opens on user click, carousel pauses */}
      {showTrailer && (
        <TrailerPlayer 
          movieId={currentMovie.id}
          title={currentMovie.title}
          trailerKey={currentMovie.trailerKey}
          poster={currentMovie.poster}
          onClose={handleCloseTrailer}
          autoPlay={true}
        />
      )}
    </section>
  );
}