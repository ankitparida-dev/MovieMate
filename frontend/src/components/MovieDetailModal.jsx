import React, { useEffect, useState, useRef } from 'react';
import WatchPlatforms from './WatchPlatforms';
import MovieNotes from './MovieNotes';
import CommentSection from './CommentSection';
import TrailerPlayer from './TrailerPlayer';
import styles from './MovieDetailModal.module.css';
import { API_TOKEN } from '../apiToken';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useMovieNotes } from '../hooks/useMovieNotes';
import { useNotifications } from '../hooks/useNotifications';

const MovieDetailModal = ({ movie, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  // ✅ TRAILER STATE
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(false);
  
  const modalRef = useRef(null);
  
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { getNote, saveNote, deleteNote } = useMovieNotes();
  const { addNotification } = useNotifications();

  const existingNote = getNote(movie?.id, movie?.media_type || 'movie');

  const handleMouseMove = (e) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      setMousePosition({ x, y });
    }
  };

  useEffect(() => {
    if (movie && movie.id) {
      addToRecentlyViewed({
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        media_type: movie.media_type || 'movie',
        vote_average: movie.vote_average
      });
      
      addNotification(
        'Recently Viewed',
        `"${movie.title || movie.name}" added to your history`,
        'info'
      );
    }
  }, [movie, addToRecentlyViewed, addNotification]);

  useEffect(() => {
    if (movie && movie.id) {
      fetchMovieDetails();
      fetchCredits();
    }
  }, [movie]);

  const fetchMovieDetails = async () => {
    try {
      const mediaType = movie.media_type || 'movie';
      const url = `https://api.themoviedb.org/3/${mediaType}/${movie.id}`;
      
      const response = await fetch(url, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`TMDB Error: ${response.status}`);
      }
      
      const data = await response.json();
      setMovieDetails(data);
    } catch (error) {
      console.error('Error fetching details:', error);
      addNotification('Error', 'Failed to load movie details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCredits = async () => {
    try {
      const mediaType = movie.media_type || 'movie';
      const url = `https://api.themoviedb.org/3/${mediaType}/${movie.id}/credits`;
      
      const response = await fetch(url, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`TMDB Error: ${response.status}`);
      }
      
      const data = await response.json();
      setCredits({
        cast: data.cast || [],
        crew: data.crew || []
      });
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  // ✅ FETCH TRAILER FROM TMDB API
  const fetchTrailer = async () => {
    if (!movie?.id) {
      console.error('No movie ID found');
      return;
    }
    
    setTrailerLoading(true);
    
    try {
      const mediaType = movie.media_type || 'movie';
      const url = `https://api.themoviedb.org/3/${mediaType}/${movie.id}/videos`;
      
      const response = await fetch(url, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`TMDB Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🎬 Videos found:', data);
      
      // Find best trailer
      const trailer = data.results?.find(
        v => v.type === 'Trailer' && v.site === 'YouTube' && v.official === true
      ) || data.results?.find(
        v => v.type === 'Trailer' && v.site === 'YouTube'
      ) || data.results?.find(
        v => v.type === 'Trailer'
      ) || data.results?.find(
        v => v.type === 'Teaser' && v.site === 'YouTube'
      ) || data.results?.[0];
      
      if (trailer) {
        setTrailerKey(trailer.key);
        setShowTrailer(true);
        console.log('✅ Trailer found:', trailer.key);
      } else {
        addNotification('No Trailer', `No trailer found for "${title}"`, 'warning');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      addNotification('Error', 'Failed to load trailer', 'error');
    } finally {
      setTrailerLoading(false);
    }
  };

  // ✅ HANDLE TRAILER CLICK
  const handlePlayTrailer = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!trailerLoading) {
      fetchTrailer();
    }
  };

  // ✅ CLOSE TRAILER
  const handleCloseTrailer = () => {
    setShowTrailer(false);
    setTrailerKey(null);
  };

  const handleSaveNote = (mediaId, mediaType, noteData) => {
    const title = movieDetails?.title || movieDetails?.name || movie.title || movie.name;
    const posterPath = movieDetails?.poster_path || movie.poster_path;
    
    saveNote(
      mediaId, mediaType, title, posterPath,
      noteData.rating, noteData.note, noteData.isFavorite
    );
  };

  const handleDeleteNote = (mediaId, mediaType) => {
    deleteNote(mediaId, mediaType);
  };

  const handleWatchlist = () => {
    addNotification(
      'Added to Watchlist',
      `"${title}" added to your watchlist`,
      'success'
    );
  };

  const handleFavorite = () => {
    addNotification(
      'Added to Favorites',
      `"${title}" added to your favorites`,
      'success'
    );
  };

  if (!movie) return null;

  const displayMovie = movieDetails || movie;
  const mediaType = movie.media_type || 'movie';
  const title = displayMovie.title || displayMovie.name;
  const posterPath = displayMovie.poster_path;
  const rating = displayMovie.vote_average;
  const releaseDate = displayMovie.release_date || displayMovie.first_air_date;
  const overview = displayMovie.overview;
  const runtime = displayMovie.runtime;
  const genres = displayMovie.genres || [];

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div 
          className={styles.modal} 
          ref={modalRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setMousePosition({ x: 0, y: 0 });
          }}
          style={{
            transform: isHovering 
              ? `perspective(1200px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg) scale(1.02)` 
              : 'perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1)',
            transition: isHovering ? 'none' : 'transform 0.3s ease'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeBtn} onClick={onClose}>×</button>
          
          <div className={styles.modalContainer}>
            {/* Hero Section */}
            <div 
              className={styles.heroSection}
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(10,25,47,0.8), rgba(10,25,47,0.95)), url(https://image.tmdb.org/t/p/original${displayMovie.backdrop_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: 'translateZ(10px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className={styles.heroContent}>
                <div 
                  className={styles.posterWrapper}
                  style={{
                    transform: isHovering ? 'translateZ(30px) rotateY(5deg)' : 'translateZ(0) rotateY(0)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  {posterPath ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w300${posterPath}`} 
                      alt={title}
                      className={styles.poster}
                    />
                  ) : (
                    <div className={styles.posterPlaceholder}>
                      <i className="fas fa-film"></i>
                    </div>
                  )}
                </div>
                
                <div 
                  className={styles.infoWrapper}
                  style={{
                    transform: isHovering ? 'translateZ(20px)' : 'translateZ(0)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <h1 className={styles.title}>{title}</h1>
                  
                  <div className={styles.metaInfo}>
                    {releaseDate && <span>{releaseDate.split('-')[0]}</span>}
                    {runtime && <span>{runtime} min</span>}
                    {rating && <span>⭐ {rating.toFixed(1)}/10</span>}
                    {mediaType === 'tv' && <span>📺 TV Series</span>}
                  </div>
                  
                  <div className={styles.genres}>
                    {genres.slice(0, 3).map(genre => (
                      <span key={genre.id} className={styles.genre}>{genre.name}</span>
                    ))}
                  </div>
                  
                  <p className={styles.overview}>{overview}</p>
                  
                  <div className={styles.actions}>
                    <button className={styles.watchlistBtn} onClick={handleWatchlist}>
                      <i className="fas fa-plus"></i> Watchlist
                    </button>
                    <button className={styles.favoriteBtn} onClick={handleFavorite}>
                      <i className="fas fa-heart"></i> Favorite
                    </button>
                    <button 
                      className={styles.trailerBtn} 
                      onClick={handlePlayTrailer}
                      disabled={trailerLoading}
                    >
                      {trailerLoading ? (
                        <>
                          <span className={styles.spinner}></span> Loading...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-play"></i> Watch Trailer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabsContainer}>
              <button 
                className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fas fa-info-circle"></i> Overview
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'cast' ? styles.active : ''}`}
                onClick={() => setActiveTab('cast')}
              >
                <i className="fas fa-users"></i> Cast & Crew
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'streaming' ? styles.active : ''}`}
                onClick={() => setActiveTab('streaming')}
              >
                <i className="fas fa-play-circle"></i> Where to Watch
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'notes' ? styles.active : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                <i className="fas fa-pen"></i> My Notes
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'comments' ? styles.active : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                <i className="fas fa-comments"></i> Comments
              </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {activeTab === 'overview' && (
                <div className={styles.overviewTab}>
                  <div className={styles.detailsSection}>
                    <h3>Details</h3>
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailItem}>
                        <strong>Status</strong>
                        <span>{displayMovie.status || 'N/A'}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <strong>Original Language</strong>
                        <span>{displayMovie.original_language?.toUpperCase() || 'N/A'}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <strong>Budget</strong>
                        <span>{displayMovie.budget ? `$${displayMovie.budget.toLocaleString()}` : 'N/A'}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <strong>Revenue</strong>
                        <span>{displayMovie.revenue ? `$${displayMovie.revenue.toLocaleString()}` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <MovieNotes 
                    movie={{
                      id: movie.id,
                      mediaType: mediaType,
                      title: title,
                      poster_path: posterPath,
                      existingNote: existingNote,
                      onSave: handleSaveNote,
                      onDelete: handleDeleteNote
                    }}
                  />
                </div>
              )}

              {activeTab === 'cast' && (
                <div className={styles.castTab}>
                  <div className={styles.castSection}>
                    <h3><i className="fas fa-users"></i> Cast</h3>
                    <div className={styles.castGrid}>
                      {credits.cast.slice(0, 12).map(actor => (
                        <div key={actor.id} className={styles.castCard}>
                          {actor.profile_path ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                              alt={actor.name}
                              className={styles.castImage}
                            />
                          ) : (
                            <div className={styles.castImagePlaceholder}>
                              <i className="fas fa-user"></i>
                            </div>
                          )}
                          <div className={styles.castInfo}>
                            <h4>{actor.name}</h4>
                            <p>{actor.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={styles.crewSection}>
                    <h3><i className="fas fa-video"></i> Crew</h3>
                    <div className={styles.crewGrid}>
                      {credits.crew.slice(0, 10).map(member => (
                        <div key={member.id} className={styles.crewCard}>
                          {member.profile_path ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                              alt={member.name}
                              className={styles.crewImage}
                            />
                          ) : (
                            <div className={styles.crewImagePlaceholder}>
                              <i className="fas fa-user"></i>
                            </div>
                          )}
                          <div className={styles.crewInfo}>
                            <h4>{member.name}</h4>
                            <p>{member.job}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'streaming' && (
                <div className={styles.streamingTab}>
                  <WatchPlatforms 
                    mediaType={mediaType}
                    id={movie.id}
                    title={title}
                  />
                </div>
              )}

              {activeTab === 'notes' && (
                <div className={styles.notesTab}>
                  <MovieNotes 
                    movie={{
                      id: movie.id,
                      mediaType: mediaType,
                      title: title,
                      poster_path: posterPath,
                      existingNote: existingNote,
                      onSave: handleSaveNote,
                      onDelete: handleDeleteNote
                    }}
                  />
                </div>
              )}

              {activeTab === 'comments' && (
                <div className={styles.commentsTab}>
                  <CommentSection 
                    movieId={movie.id}
                    movieTitle={title}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ TRAILER PLAYER MODAL */}
      {showTrailer && trailerKey && (
        <TrailerPlayer 
          title={title}
          trailerKey={trailerKey}
          poster={posterPath}
          onClose={handleCloseTrailer}
          autoPlay={true}
        />
      )}
    </>
  );
};
 
export default MovieDetailModal;