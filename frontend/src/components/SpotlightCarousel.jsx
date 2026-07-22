import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './SpotlightCarousel.module.css';
import { request } from '../api/tmdb';
import { getFavorites, getUserNotes, getWatchlist } from '../api/api';
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
};

const LoadingPlaceholder = () => (
  <div className={styles.movieSection} style={{ height: '80vh', display: 'grid', placeContent: 'center' }}>
    <div className={styles.loadingSpinner}>
      <div className={styles.spinner}></div>
      <h2 className={styles.loadingText}>Loading Your Movies...</h2>
    </div>
  </div>
);

// ✅ Empty State with working explore button
const EmptyState = ({ onExploreClick }) => (
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
      <i className="fas fa-star" style={{ fontSize: '4rem', color: '#ffc107', opacity: 0.5 }}></i>
    </div>
    <h2 style={{ marginTop: '20px', fontSize: '2rem' }}>No Rated Movies Yet</h2>
    <p style={{ color: '#8892b0', maxWidth: '400px', marginTop: '10px' }}>
      Start rating movies you've watched to see your top picks here!
    </p>
    <button 
      className={styles.detailButton} 
      onClick={onExploreClick}
      style={{ marginTop: '20px', cursor: 'pointer' }}
    >
      <i className="fas fa-play"></i> Explore Movies
    </button>
  </div>
);

// ✅ Get ranking badge based on position
const getRankingBadge = (index) => {
  const ranks = [
    { label: '🥇', color: '#ffd700', bg: 'rgba(255, 215, 0, 0.2)' },
    { label: '🥈', color: '#c0c0c0', bg: 'rgba(192, 192, 192, 0.2)' },
    { label: '🥉', color: '#cd7f32', bg: 'rgba(205, 127, 50, 0.2)' },
    { label: '🏅', color: '#2ec4b6', bg: 'rgba(46, 196, 182, 0.15)' },
    { label: '🏅', color: '#2ec4b6', bg: 'rgba(46, 196, 182, 0.15)' },
  ];
  return ranks[index] || ranks[ranks.length - 1];
};

export default function SpotlightCarousel({ onOpen, setPage }) {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [currentTrailerKey, setCurrentTrailerKey] = useState(null);
  const [currentSlideTitle, setCurrentSlideTitle] = useState('');
  const [currentSlidePoster, setCurrentSlidePoster] = useState(null);

  const carouselRef = useRef(null);

  // ✅ Fetch user's rated movies from notes OR favorites
  useEffect(() => {
    const fetchUserMovies = async () => {
      setLoading(true);
      try {
        // ✅ Try to get notes with ratings first
        let ratedMovies = [];
        let favorites = [];

        try {
          const notes = await getUserNotes();
          if (notes && notes.length > 0) {
            ratedMovies = notes.filter(note => note.rating && note.rating > 0);
          }
        } catch (error) {
          console.error('Error fetching notes:', error);
        }

        // ✅ If no rated movies, try to get favorites
        if (ratedMovies.length === 0) {
          try {
            favorites = await getFavorites();
          } catch (error) {
            console.error('Error fetching favorites:', error);
          }
        }

        // ✅ Use rated movies if available, otherwise use favorites
        const sourceMovies = ratedMovies.length > 0 ? ratedMovies : favorites;
        
        // ✅ If no rated movies and no favorites
        if (sourceMovies.length === 0) {
          // ✅ Try to get watchlist as fallback
          try {
            const watchlist = await getWatchlist();
            if (watchlist && watchlist.length > 0) {
              const fallbackMovies = watchlist.slice(0, 10).map((item, index) => ({
                id: item.id || item.movieId,
                title: item.title,
                poster_path: item.poster_path,
                media_type: 'movie',
                userRating: 0,
                userNote: '',
                isFavorite: false,
                rank: index + 1
              }));
              
              const movieDetails = await fetchMovieDetails(fallbackMovies);
              setSlides(movieDetails);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error('Error fetching watchlist:', error);
          }
          
          setSlides([]);
          setLoading(false);
          return;
        }

        // ✅ Process rated movies or favorites
        const sortedMovies = ratedMovies.length > 0 
          ? ratedMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10)
          : favorites.slice(0, 10).map((item, index) => ({
              mediaId: item.id || item.movieId,
              title: item.title,
              poster_path: item.poster_path,
              media_type: 'movie',
              rating: 0,
              note: '',
              isFavorite: true,
              rank: index + 1
            }));

        // ✅ Fetch full movie details
        const movieDetails = await Promise.all(
          sortedMovies.map(async (movie, index) => {
            try {
              const id = movie.mediaId || movie.id || movie.movieId;
              if (!id) return null;
              
              const data = await request(`/movie/${id}`);
              return {
                id: data.id,
                title: data.title,
                poster_path: data.poster_path,
                backdrop_path: data.backdrop_path,
                vote_average: data.vote_average,
                release_date: data.release_date,
                overview: data.overview,
                vote_count: data.vote_count,
                media_type: 'movie',
                userRating: movie.rating || 0,
                userNote: movie.note || '',
                isFavorite: movie.isFavorite || true,
                rank: index + 1
              };
            } catch (error) {
              console.error('Error fetching movie details:', error);
              return null;
            }
          })
        );

        const validMovies = movieDetails.filter(m => m !== null);
        setSlides(validMovies);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Helper function to fetch movie details
    const fetchMovieDetails = async (movies) => {
      const details = await Promise.all(
        movies.map(async (movie) => {
          try {
            if (!movie.id) return null;
            const data = await request(`/movie/${movie.id}`);
            return {
              id: data.id,
              title: data.title,
              poster_path: data.poster_path,
              backdrop_path: data.backdrop_path,
              vote_average: data.vote_average,
              release_date: data.release_date,
              overview: data.overview,
              vote_count: data.vote_count,
              media_type: 'movie',
              userRating: 0,
              userNote: '',
              isFavorite: false,
              rank: movie.rank || 0
            };
          } catch (error) {
            return null;
          }
        })
      );
      return details.filter(m => m !== null);
    };

    fetchUserMovies();
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

  // ✅ Handle Explore Movies - Navigate to Movies Page
  const handleExploreMovies = () => {
    // ✅ Use setPage if available (from App.jsx)
    if (setPage) {
      setPage('movies');
      return;
    }
    
    // ✅ Fallback: Use onOpen with page property
    if (typeof onOpen === 'function') {
      onOpen({ page: 'movies' });
    }
  };

  // ✅ Show loading state
  if (loading) {
    return <LoadingPlaceholder />;
  }

  // ✅ Show empty state if no movies
  if (slides.length === 0) {
    return <EmptyState onExploreClick={handleExploreMovies} />;
  }

  const currentSlide = slides[currentIndex];
  const backgroundUrl = currentSlide.backdrop_path 
    ? `${IMG_BACKDROP_URL}${currentSlide.backdrop_path}`
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200';
  const title = currentSlide.title || currentSlide.name || 'Unknown';
  const year = (currentSlide.release_date || currentSlide.first_air_date || "").slice(0, 4);
  const rating = currentSlide.vote_average ? currentSlide.vote_average.toFixed(1) : 'N/A';
  const mediaType = currentSlide.media_type || 'movie';
  const ranking = currentSlide.rank || currentIndex + 1;
  const rankBadge = getRankingBadge(ranking - 1);

  // ✅ Generate star rating display
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 10 - fullStars - halfStar;
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '★';
    if (halfStar) stars += '☆';
    for (let i = 0; i < emptyStars; i++) stars += '☆';
    
    return stars;
  };

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
              {/* ✅ Ranking Badge */}
              <div className={styles.rankingBadge} style={{ 
                background: rankBadge.bg,
                borderColor: rankBadge.color
              }}>
                <span className={styles.rankEmoji}>{rankBadge.label}</span>
                <span className={styles.rankNumber}>#{ranking}</span>
              </div>

              <span className={styles.spotlight}>
                <i className="fas fa-star"></i> {currentSlide.userRating > 0 ? 'Your Top Rated' : 'Your Favorites'}
              </span>

              <h1 className={styles.showName}>{title}</h1>

              <div className={styles.details}>
                <p><i className="fas fa-play-circle"></i> {mediaType === 'tv' ? 'TV Series' : 'Movie'}</p>
                <p><i className="far fa-calendar-alt"></i> {year || 'N/A'}</p>
                <p><i className="fas fa-star"></i> TMDB: {rating}/10</p>
              </div>

              {/* ✅ User Rating Display - Only show if user has rated */}
              {currentSlide.userRating > 0 && (
                <div className={styles.userRatingContainer}>
                  <div className={styles.userRatingStars}>
                    <span className={styles.starLabel}>Your Rating:</span>
                    <span className={styles.starsDisplay}>{renderStars(currentSlide.userRating)}</span>
                    <span className={styles.userRatingValue}>{currentSlide.userRating}/10</span>
                  </div>
                  {currentSlide.userNote && (
                    <p className={styles.userNote}>📝 "{currentSlide.userNote}"</p>
                  )}
                  {currentSlide.isFavorite && (
                    <span className={styles.favoriteTag}>
                      <i className="fas fa-heart"></i> Favorite
                    </span>
                  )}
                </div>
              )}

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
            {slides.map((slide, index) => (
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
              >
                {slide.userRating > 0 ? slide.userRating : '★'}
              </button>
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

      {/* ✅ TRAILER PLAYER MODAL */}
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