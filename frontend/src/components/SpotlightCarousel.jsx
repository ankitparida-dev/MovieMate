import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './SpotlightCarousel.module.css';
import { request } from '../api/tmdb';
import { getFavorites } from '../api/api';
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
  603: "bLvqo1L9vPk",    // The Matrix
  120: "2LqzF5WauAw",    // Lord of the Rings
  769: "5xH0HfJHsaY",    // Goodfellas
  550: "2LqzF5WauAw",    // Fight Club
  122: "5NYt1qirBWg",    // Lord of the Rings: The Two Towers
};

const LoadingPlaceholder = () => (
  <div className={styles.movieSection} style={{ height: '80vh', display: 'grid', placeContent: 'center' }}>
    <div className={styles.loadingSpinner}>
      <div className={styles.spinner}></div>
      <h2 className={styles.loadingText}>Loading Your Favorites...</h2>
    </div>
  </div>
);

const EmptyFavorites = ({ onExploreClick }) => (
  <div className={styles.movieSection} style={{ 
    height: '80vh', 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#0a192f',
    color: '#ffffff',
    textAlign: 'center',
    padding: '20px'
  }}>
    <div className={styles.emptyStateIcon}>
      <i className="fas fa-heart" style={{ fontSize: '4rem', color: '#2ec4b6', opacity: 0.5 }}></i>
    </div>
    <h2 style={{ marginTop: '20px', fontSize: '2rem' }}>No Favorites Yet</h2>
    <p style={{ color: '#8892b0', maxWidth: '400px', marginTop: '10px' }}>
      Start exploring movies and add them to your favorites to see them here!
    </p>
    <button 
      className={styles.detailButton} 
      onClick={onExploreClick}
      style={{ marginTop: '20px' }}
    >
      <i className="fas fa-play"></i> Explore Movies
    </button>
  </div>
);

export default function SpotlightCarousel({ onOpen }) {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [currentTrailerKey, setCurrentTrailerKey] = useState(null);
  const [currentSlideTitle, setCurrentSlideTitle] = useState('');
  const [currentSlidePoster, setCurrentSlidePoster] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const carouselRef = useRef(null);

  // ✅ Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  // ✅ Fetch user's favorite movies
  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      setLoading(true);
      try {
        const favorites = await getFavorites();
        
        if (favorites && favorites.length > 0) {
          // ✅ Fetch full details for each favorite movie
          const movieDetails = await Promise.all(
            favorites.slice(0, 5).map(async (fav) => {
              try {
                const data = await request(`/movie/${fav.id || fav.movieId}`);
                return {
                  id: data.id,
                  title: data.title,
                  poster_path: data.poster_path,
                  backdrop_path: data.backdrop_path,
                  vote_average: data.vote_average,
                  release_date: data.release_date,
                  overview: data.overview,
                  vote_count: data.vote_count,
                  media_type: 'movie'
                };
              } catch (error) {
                console.error('Error fetching movie details:', error);
                return null;
              }
            })
          );

          // ✅ Filter out any failed requests
          const validMovies = movieDetails.filter(m => m !== null);
          setSlides(validMovies);
        } else {
          setSlides([]);
        }
      } catch (error) {
        console.error('Failed to fetch favorite movies:', error);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (slides.length === 0 || showTrailer) return;
    
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

  // ✅ Handle trailer play
  const handlePlayTrailer = (slide) => {
    const trailerKey = TRAILER_KEYS[slide.id];
    if (trailerKey) {
      setCurrentTrailerKey(trailerKey);
      setCurrentSlideTitle(slide.title || slide.name);
      setCurrentSlidePoster(slide.poster_path);
      setShowTrailer(true);
      console.log('🎬 Playing trailer for:', slide.title || slide.name);
    } else {
      fetchTrailerFromTMDB(slide);
    }
  };

  // ✅ Fallback: Fetch trailer from TMDB API
  const fetchTrailerFromTMDB = async (slide) => {
    try {
      const mediaType = slide.media_type || 'movie';
      const url = `https://api.themoviedb.org/3/${mediaType}/${slide.id}/videos`;
      const token = import.meta.env.VITE_TMDB_TOKEN || process.env.REACT_APP_TMDB_TOKEN;
      
      const response = await fetch(url, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      const trailer = data.results?.find(
        v => v.type === 'Trailer' && v.site === 'YouTube'
      ) || data.results?.[0];
      
      if (trailer) {
        setCurrentTrailerKey(trailer.key);
        setCurrentSlideTitle(slide.title || slide.name);
        setCurrentSlidePoster(slide.poster_path);
        setShowTrailer(true);
      } else {
        alert(`No trailer available for "${slide.title || slide.name}"`);
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      alert('Failed to load trailer. Please try again.');
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
    setCurrentTrailerKey(null);
    setCurrentSlideTitle('');
    setCurrentSlidePoster(null);
  };

  // ✅ Show loading state
  if (loading) {
    return <LoadingPlaceholder />;
  }

  // ✅ Show empty state if no favorites
  if (slides.length === 0) {
    return <EmptyFavorites onExploreClick={() => onOpen({})} />;
  }

  const currentSlide = slides[currentIndex];
  const backgroundUrl = `${IMG_BACKDROP_URL}${currentSlide.backdrop_path}`;
  const title = currentSlide.title || currentSlide.name;
  const year = (currentSlide.release_date || currentSlide.first_air_date || "").slice(0, 4);
  const rating = currentSlide.vote_average ? currentSlide.vote_average.toFixed(1) : 'N/A';
  const mediaType = currentSlide.media_type || 'movie';

  return (
    <>
      <section 
        className={styles.movieSection}
        ref={carouselRef}
      >
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
          
          <div className="container" style={{ zIndex: 2, position: 'relative' }}>
            <div className={styles.movieItems}>
              <span className={styles.spotlight}>
                <i className="fas fa-heart"></i> Your Favorites
              </span>
              <h1 className={styles.showName}>{title}</h1>
              <div className={styles.details}>
                <p><i className="fas fa-play-circle"></i> {mediaType === 'tv' ? 'TV Series' : 'Movie'}</p>
                <p><i className="far fa-calendar-alt"></i> {year || 'N/A'}</p>
                <p><i className="fas fa-star"></i> {rating}/10</p>
              </div>
              <p className={styles.overview}>{currentSlide.overview}</p>
              <div className={styles.interstellarButtons}>
                <button 
                  className={styles.trailer}
                  onClick={() => handlePlayTrailer(currentSlide)}
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
      </section>

      {/* ✅ TRAILER PLAYER MODAL - RENDERED WITH PORTAL AT ROOT LEVEL */}
      {showTrailer && currentTrailerKey && ReactDOM.createPortal(
        <TrailerPlayer 
          title={currentSlideTitle}
          trailerKey={currentTrailerKey}
          poster={currentSlidePoster}
          onClose={handleCloseTrailer}
          autoPlay={true}
        />,
        document.body
      )}
    </>
  );
}