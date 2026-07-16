import React, { useState, useEffect, useRef } from 'react';
import styles from './SpotlightCarousel.module.css';
import { request } from '../api/tmdb';
import TrailerPlayer from './TrailerPlayer';

const IMG_BACKDROP_URL = "https://image.tmdb.org/t/p/original";

// ✅ Manual trailer keys for movies
const TRAILER_KEYS = {
  27205: "YoHD9XEInc0",  // Inception
  157336: "zSWdZVtXT7E", // Interstellar
  155: "EXeTwQWrcwY",    // The Dark Knight
  299534: "TcMBFSGVi1c", // Avengers: Endgame
  496243: "5xH0HfJHsaY", // Parasite
  278: "6hB3S9bIaco",    // Shawshank Redemption
  680: "s7EdQ4FqbhY",    // Pulp Fiction
  13: "5NYt1qirBWg",     // Forrest Gump
};

const LoadingPlaceholder = () => (
  <div className={styles.movieSection} style={{ height: '80vh', display: 'grid', placeContent: 'center' }}>
    <div className={styles.loadingSpinner}>
      <div className={styles.spinner}></div>
      <h2 className={styles.loadingText}>Loading Spotlight...</h2>
    </div>
  </div>
);

export default function SpotlightCarousel({ onOpen }) {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [currentTrailerKey, setCurrentTrailerKey] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchTopSlides = async () => {
      setLoading(true);
      try {
        const data = await request("/trending/all/week");
        setSlides(data.results.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch slides:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSlides();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (slides.length === 0 || showTrailer) return; // ✅ Pause when trailer is open
    
    const interval = setInterval(() => {
      goToNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [slides, currentIndex, showTrailer]);

  const goToPrevious = () => {
    if (isTransitioning || showTrailer) return;
    setIsTransitioning(true);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToNext = () => {
    if (isTransitioning || showTrailer) return;
    setIsTransitioning(true);
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleMouseMove = (e) => {
    if (carouselRef.current) {
      const rect = carouselRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
      setMousePosition({ x, y });
    }
  };

  // ✅ Handle trailer play
  const handlePlayTrailer = (slideId) => {
    const trailerKey = TRAILER_KEYS[slideId];
    if (trailerKey) {
      setCurrentTrailerKey(trailerKey);
      setShowTrailer(true);
    } else {
      alert('No trailer available for this movie');
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
    setCurrentTrailerKey(null);
  };

  if (loading) {
    return <LoadingPlaceholder />;
  }

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];
  const backgroundUrl = `${IMG_BACKDROP_URL}${currentSlide.backdrop_path}`;
  const title = currentSlide.title || currentSlide.name;
  const year = (currentSlide.release_date || currentSlide.first_air_date || "").slice(0, 4);
  const rating = currentSlide.vote_average ? currentSlide.vote_average.toFixed(1) : 'N/A';
  const mediaType = currentSlide.media_type;

  return (
    <section 
      className={styles.movieSection}
      ref={carouselRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
    >
      <div 
        className={styles.carouselImage}
        style={{
          transform: isHovering 
            ? `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)` 
            : 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
          transition: isHovering ? 'none' : 'transform 0.3s ease',
          backgroundImage: `
            linear-gradient(rgba(10, 25, 47, 0.7), rgba(10, 25, 47, 0.8)), 
            url(${backgroundUrl})
          `
        }}
      >
        <div className={styles.overlay}></div>
        
        {/* 3D Floating Particles */}
        <div className={styles.particlesContainer}>
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`
              }}
            />
          ))}
        </div>
        
        <div className="container" style={{ zIndex: 2, position: 'relative' }}>
          <div className={styles.movieItems}>
            <span className={styles.spotlight}>
              <i className="fas fa-star"></i> #{currentIndex + 1} Spotlight
            </span>
            <h1 className={styles.showName}>{title}</h1>
            <div className={styles.details}>
              <p><i className="fas fa-play-circle"></i> {mediaType === 'tv' ? 'TV Series' : 'Movie'}</p>
              <p><i className="far fa-calendar-alt"></i> {year}</p>
              <p><i className="fas fa-star"></i> {rating}/10</p>
            </div>
            <p className={styles.overview}>{currentSlide.overview}</p>
            <div className={styles.interstellarButtons}>
              <button 
                className={styles.trailer}
                onClick={() => handlePlayTrailer(currentSlide.id)}
              >
                <i className="fas fa-play"></i> Watch Trailer
              </button>
              <button 
                className={styles.detailButton} 
                onClick={() => onOpen(currentSlide)}
              >
                <i className="fas fa-info-circle"></i> View Details
              </button>
            </div>
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div className={styles.indicators}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => {
                if (!isTransitioning && !showTrailer) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }
              }}
            />
          ))}
        </div>

        <div className={styles.nextPrev}>
          <button className={styles.prev} onClick={goToPrevious}>
            &#10094;
          </button>
          <button className={styles.next} onClick={goToNext}>
            &#10095;
          </button>
        </div>
      </div>

      {/* ✅ TRAILER PLAYER MODAL */}
      {showTrailer && (
        <TrailerPlayer 
          title={currentSlide.title || currentSlide.name}
          trailerKey={currentTrailerKey}
          poster={currentSlide.poster_path}
          onClose={handleCloseTrailer}
          autoPlay={true}
        />
      )}
    </section>
  );
}