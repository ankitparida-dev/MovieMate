import React, { useState, useEffect } from 'react';
import styles from './SpotlightCarousel.module.css';
import { request } from '../api/tmdb'; // Import your API helper

const IMG_BACKDROP_URL = "https://image.tmdb.org/t/p/original";

const LoadingPlaceholder = () => (
  <div className={styles.movieSection} style={{ height: '80vh', display: 'grid', placeContent: 'center' }}>
    <h2 className={styles.loadingText}>Loading Spotlight...</h2>
  </div>
);

export default function SpotlightCarousel({ onOpen }) {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSlides = async () => {
      setLoading(true);
      try {
        const data = await request("/trending/all/week");
        setSlides(data.results.slice(0, 4)); // Get top 4
      } catch (err) {
        console.error("Failed to fetch slides:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSlides();
  }, []);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
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
    <section className={styles.movieSection}>
      <div 
        className={styles.carouselImage} 
        style={{ 
          backgroundImage: `
            linear-gradient(rgba(10, 25, 47, 0.7), rgba(10, 25, 47, 0.8)), 
            url(${backgroundUrl})
          `
        }}
      >
        <div className={styles.overlay}></div>
        
        {/* --- THIS IS THE FIX ---
          We add a 'container' div here to be the flex item.
          This centers the content block vertically and 
          applies the correct max-width and horizontal margin.
        */}
        <div className="container" style={{ zIndex: 2, position: 'relative' }}>
          <div className={styles.movieItems}> {/* <-- Removed .container from here */}
            <span className={styles.spotlight}>#{currentIndex + 1} Spotlight</span>
            <h1 className={styles.showName}>{title}</h1>
            <div className={styles.details}>
              <p><i className="fas fa-play-circle"></i> {mediaType === 'tv' ? 'TV Series' : 'Movie'}</p>
              <p><i className="far fa-calendar-alt"></i> {year}</p>
              <p><i className="fas fa-star"></i> {rating}/10</p>
            </div>
            <p className={styles.overview}>{currentSlide.overview}</p>
            <div className={styles.interstellarButtons}>
              <button className={styles.trailer}><i className="fas fa-play"></i> Watch Trailer</button>
              <button 
                className={styles.detailButton} 
                onClick={() => onOpen(currentSlide)}
              >
                <i className="fas fa-info-circle"></i> View Details
              </button>
            </div>
          </div>
        </div>
        
        {/* The Next/Prev buttons */}
        <div className={styles.nextPrev}>
          <button className={styles.prev} aria-label="Previous movie" onClick={goToPrevious}>
            &#10094;
          </button>
          <button className={styles.next} aria-label="Next movie" onClick={goToNext}>
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}