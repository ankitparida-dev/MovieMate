import React, { useState, useEffect, useRef } from 'react';
import styles from './HeroBanner.module.css';
import TrailerPlayer from './TrailerPlayer';
import { request } from '../api/tmdb';
import { 
  addToWatchlist, 
  addToFavorites, 
  removeFromCollection,
  getFavorites,
  getWatchlist
} from '../api/api';
import toast from 'react-hot-toast';

// The texts for typing animation
const TEXTS_TO_TYPE = [
  "Cinematic Experience",
  "Movie Discovery",
  "TV Show Paradise",
  "Entertainment Hub",
  "Personalized Picks"
];

export default function HeroBanner({ onExploreClick }) {
  const [typedText, setTypedText] = useState('');
  const [movies, setMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ Watchlist/Favorites Status
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [isUpdating, setIsUpdating] = useState(false);

  const textIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const typingSpeed = useRef(100);
  const carouselIntervalRef = useRef(null);

  // ✅ Fetch trending movies from TMDB
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await request('/trending/movie/week');
        const topMovies = data.results.slice(0, 5).map(movie => ({
          id: movie.id,
          title: movie.title,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
          rating: movie.vote_average,
          year: movie.release_date?.slice(0, 4) || 'N/A',
          overview: movie.overview,
          vote_count: movie.vote_count
        }));
        setMovies(topMovies);
      } catch (error) {
        console.error('Failed to fetch trending movies:', error);
        setMovies(getFallbackMovies());
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // ✅ Fetch user's library status
  const fetchLibraryStatus = async () => {
    try {
      const [favorites, watchlist] = await Promise.all([
        getFavorites(),
        getWatchlist()
      ]);
      
      const favIds = new Set(favorites.map(item => item.id || item.movieId));
      const watchIds = new Set(watchlist.map(item => item.id || item.movieId));
      
      setFavoriteIds(favIds);
      setWatchlistIds(watchIds);
    } catch (error) {
      console.error('Error fetching library status:', error);
    }
  };

  // ✅ Refresh status when movies change or user logs in
  useEffect(() => {
    if (movies.length > 0) {
      fetchLibraryStatus();
    }
  }, [movies]);

  // ✅ Fallback movies if API fails
  const getFallbackMovies = () => [
    {
      id: 603,
      title: "The Matrix",
      poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      backdrop: "https://image.tmdb.org/t/p/original/fNjTjIU43zhsRnI6cOIP9QK2GdP.jpg",
      rating: 8.7,
      year: '1999',
      overview: "A computer programmer discovers a shocking reality about his world.",
      vote_count: 25000
    },
    {
      id: 157336,
      title: "Interstellar",
      poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdrop: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
      rating: 8.6,
      year: '2014',
      overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      vote_count: 35000
    },
    {
      id: 155,
      title: "The Dark Knight",
      poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop: "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
      rating: 9.0,
      year: '2008',
      overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.",
      vote_count: 28000
    },
    {
      id: 299534,
      title: "Avengers: Endgame",
      poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      backdrop: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
      rating: 8.4,
      year: '2019',
      overview: "After the devastating events of Avengers: Infinity War, the universe is in ruins.",
      vote_count: 30000
    },
    {
      id: 496243,
      title: "Parasite",
      poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
      backdrop: "https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
      rating: 8.6,
      year: '2019',
      overview: "A poor family schemes to become employed by a wealthy family and infiltrate their household.",
      vote_count: 18000
    }
  ];

  // ✅ Fetch trailer for current movie
  const fetchTrailer = async (movieId) => {
    try {
      const data = await request(`/movie/${movieId}/videos`);
      const trailer = data.results?.find(
        v => v.type === 'Trailer' && v.site === 'YouTube'
      ) || data.results?.[0];
      return trailer?.key || null;
    } catch (error) {
      console.error('Error fetching trailer:', error);
      return null;
    }
  };

  // ✅ Typing animation
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

  // ✅ Carousel auto-play
  useEffect(() => {
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
    }

    if (!showTrailer && movies.length > 0 && !loading) {
      carouselIntervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentMovieIndex((prev) => (prev + 1) % movies.length);
          setIsTransitioning(false);
        }, 500);
      }, 6000);
    }

    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [showTrailer, movies, loading]);

  const currentMovie = movies[currentMovieIndex] || null;

  // ✅ Handle "Add to Watchlist"
  const handleAddToWatchlist = async (e) => {
    e.stopPropagation();
    if (!currentMovie || isUpdating) return;
    
    setIsUpdating(true);
    const isInWatchlist = watchlistIds.has(currentMovie.id);

    try {
      if (isInWatchlist) {
        await removeFromCollection('watchlist', currentMovie.id);
        setWatchlistIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentMovie.id);
          return newSet;
        });
        toast.success(`Removed "${currentMovie.title}" from watchlist`);
      } else {
        await addToWatchlist({
          id: currentMovie.id,
          title: currentMovie.title,
          poster_path: currentMovie.poster?.split('/').pop(),
          vote_average: currentMovie.rating,
          release_date: currentMovie.year ? `${currentMovie.year}-01-01` : null
        });
        setWatchlistIds(prev => new Set([...prev, currentMovie.id]));
        toast.success(`"${currentMovie.title}" added to watchlist! 🎬`);
      }
    } catch (error) {
      toast.error(isInWatchlist ? 'Failed to remove from watchlist' : 'Failed to add to watchlist');
      console.error('Error updating watchlist:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // ✅ Handle "Add to Favorites"
  const handleAddToFavorites = async (e) => {
    e.stopPropagation();
    if (!currentMovie || isUpdating) return;
    
    setIsUpdating(true);
    const isInFavorites = favoriteIds.has(currentMovie.id);

    try {
      if (isInFavorites) {
        await removeFromCollection('favorites', currentMovie.id);
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentMovie.id);
          return newSet;
        });
        toast.success(`Removed "${currentMovie.title}" from favorites`);
      } else {
        await addToFavorites({
          id: currentMovie.id,
          title: currentMovie.title,
          poster_path: currentMovie.poster?.split('/').pop(),
          vote_average: currentMovie.rating,
          release_date: currentMovie.year ? `${currentMovie.year}-01-01` : null
        });
        setFavoriteIds(prev => new Set([...prev, currentMovie.id]));
        toast.success(`"${currentMovie.title}" added to favorites! ❤️`);
      }
    } catch (error) {
      toast.error(isInFavorites ? 'Failed to remove from favorites' : 'Failed to add to favorites');
      console.error('Error updating favorites:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // ✅ Handle "Watch Trailer" - SINGLE FUNCTION
  const handleOpenTrailer = async () => {
    if (!currentMovie) return;
    
    const key = await fetchTrailer(currentMovie.id);
    if (key) {
      setTrailerKey(key);
      setShowTrailer(true);
    } else {
      toast.error('No trailer available for this movie');
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
    setTrailerKey(null);
  };

  const goToMovie = (index) => {
    if (!showTrailer) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentMovieIndex(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  if (loading) {
    return (
      <section className={styles.heroSection} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        minHeight: '100vh'
      }}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading cinematic experience...</p>
        </div>
      </section>
    );
  }

  if (!currentMovie || movies.length === 0) {
    return (
      <section className={styles.heroSection} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        minHeight: '100vh',
        color: '#ffffff'
      }}>
        <p>No movies available. Please try again later.</p>
      </section>
    );
  }

  const isInWatchlist = watchlistIds.has(currentMovie.id);
  const isInFavorites = favoriteIds.has(currentMovie.id);

  return (
    <section className={styles.heroSection}>
      {/* Background Image with Overlay */}
      <div className={styles.backgroundContainer}>
        <div 
          className={`${styles.backgroundImage} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}
          style={{ 
            backgroundImage: `url(${currentMovie.backdrop})`,
            opacity: 1
          }}
        />
        <div className={styles.overlay}></div>
        <div className={styles.gradientOverlay}></div>
      </div>

      {/* Movie Cards Carousel in Background */}
      <div className={styles.carouselContainer}>
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`${styles.movieCard} ${index === currentMovieIndex ? styles.active : ''}`}
            style={{
              transform: `translateX(${(index - currentMovieIndex) * 120}%) rotate(${(index - currentMovieIndex) * 5}deg)`,
              opacity: Math.abs(index - currentMovieIndex) <= 2 ? 1 : 0,
              zIndex: movies.length - Math.abs(index - currentMovieIndex)
            }}
          >
            <img src={movie.poster} alt={movie.title} loading="lazy" />
            <div className={styles.movieCardInfo}>
              <h4>{movie.title}</h4>
              <div className={styles.movieCardRating}>
                <i className="fas fa-star"></i>
                <span>{movie.rating?.toFixed(1) || 'N/A'}</span>
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

            <div className={styles.heroActions}>
              <button 
                className={`${styles.heroBtn} ${styles.playBtn}`}
                onClick={onExploreClick}
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
              {/* ✅ POSTER - Click to open trailer */}
              <div 
                className={styles.currentMoviePoster}
                onClick={handleOpenTrailer}
                style={{ cursor: 'pointer' }}
              >
                <img src={currentMovie.poster} alt={currentMovie.title} />
                <div className={styles.currentMovieBadge}>
                  <span>#{currentMovieIndex + 1} Trending</span>
                </div>
                {/* ✅ PLAY OVERLAY - Shows on hover */}
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
                    <i className="fas fa-star"></i> {currentMovie.rating?.toFixed(1) || 'N/A'}/10
                  </span>
                  <span className={styles.votes}>
                    <i className="fas fa-users"></i> {currentMovie.vote_count || 0}
                  </span>
                </div>
                <p className={styles.movieOverview}>
                  {currentMovie.overview?.slice(0, 80) || 'No overview available.'}...
                </p>
                <div className={styles.currentMovieActions}>
                  {/* ✅ REMOVED DUPLICATE WATCH TRAILER BUTTON - Only Watchlist & Favorites remain */}
                  <button 
                    className={`${styles.actionIconBtn} ${isInWatchlist ? styles.active : ''}`}
                    onClick={handleAddToWatchlist}
                    disabled={isUpdating}
                    title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  >
                    <i className={`fas ${isInWatchlist ? 'fa-check' : 'fa-plus'}`}></i>
                  </button>
                  <button 
                    className={`${styles.actionIconBtn} ${isInFavorites ? styles.activeHeart : ''}`}
                    onClick={handleAddToFavorites}
                    disabled={isUpdating}
                    title={isInFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
                  >
                    <i className={`fas ${isInFavorites ? 'fa-heart' : 'fa-heart'}`}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Carousel Indicators */}
      <div className={styles.carouselIndicators}>
        {movies.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentMovieIndex ? styles.active : ''}`}
            onClick={() => goToMovie(index)}
            disabled={showTrailer}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <span>Scroll to explore</span>
        <i className="fas fa-chevron-down"></i>
      </div>

      {/* TRAILER PLAYER */}
      {showTrailer && trailerKey && (
        <TrailerPlayer 
          movieId={currentMovie.id}
          title={currentMovie.title}
          trailerKey={trailerKey}
          poster={currentMovie.poster}
          onClose={handleCloseTrailer}
          autoPlay={true}
        />
      )}
    </section>
  );
}