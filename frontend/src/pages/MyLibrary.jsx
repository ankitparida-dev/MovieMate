import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { getFavorites, getWatchlist, getHistory, removeFromCollection } from "../api/api";
import { useMovieNotes } from "../hooks/useMovieNotes";
import styles from "./MyLibrary.module.css";

export default function MyLibrary({ onOpen }) {
  // ✅ Library State
  const [activeTab, setActiveTab] = useState("favorites");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ Notes State
  const { notes, deleteNote, getFavorites: getNoteFavorites, getRatedMovies } = useMovieNotes();
  const [noteFilter, setNoteFilter] = useState('all');
  const [filteredNotes, setFilteredNotes] = useState([]);

  // ✅ Fetch Library Data
  useEffect(() => {
    if (activeTab === 'favorites' || activeTab === 'watchlist' || activeTab === 'history') {
      setLoading(true);
      const fetchData = async () => {
        let data = [];
        if (activeTab === "favorites") data = await getFavorites();
        else if (activeTab === "watchlist") data = await getWatchlist();
        else if (activeTab === "history") data = await getHistory();
        setMovies(data);
        setLoading(false);
      };
      fetchData();
    }
  }, [activeTab]);

  // ✅ Filter Notes
  useEffect(() => {
    if (activeTab === 'notes') {
      if (noteFilter === 'all') {
        setFilteredNotes(notes);
      } else if (noteFilter === 'favorites') {
        setFilteredNotes(getNoteFavorites());
      } else if (noteFilter === 'rated') {
        setFilteredNotes(getRatedMovies());
      }
    }
  }, [notes, noteFilter, activeTab, getNoteFavorites, getRatedMovies]);

  // ✅ Handle Remove from Library
  const handleRemove = async (e, movieId) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Remove this title from your library?");
    if (!confirmDelete) return;
    await removeFromCollection(activeTab, movieId);
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  // ✅ Handle Delete Note
  const handleDeleteNote = (mediaId, mediaType) => {
    if (window.confirm('Delete this note?')) {
      deleteNote(mediaId, mediaType);
    }
  };

  // ✅ Get Rating Stars
  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(10 - rating);
  };

  // ✅ Render Notes Content
  const renderNotesContent = () => {
    if (notes.length === 0) {
      return (
        <div className={styles.emptyState}>
          <i className="fas fa-sticky-note"></i>
          <h3>No Notes Yet</h3>
          <p>Add notes and ratings to movies you've watched!</p>
        </div>
      );
    }

    return (
      <>
        <div className={styles.noteFilters}>
          <button 
            className={`${styles.noteFilterBtn} ${noteFilter === 'all' ? styles.active : ''}`}
            onClick={() => setNoteFilter('all')}
          >
            All Notes ({notes.length})
          </button>
          <button 
            className={`${styles.noteFilterBtn} ${noteFilter === 'favorites' ? styles.active : ''}`}
            onClick={() => setNoteFilter('favorites')}
          >
            Favorites ({getNoteFavorites().length})
          </button>
          <button 
            className={`${styles.noteFilterBtn} ${noteFilter === 'rated' ? styles.active : ''}`}
            onClick={() => setNoteFilter('rated')}
          >
            Rated ({getRatedMovies().length})
          </button>
        </div>

        <div className={styles.notesGrid}>
          {filteredNotes.map((note) => (
            <div key={`${note.mediaId}-${note.mediaType}`} className={styles.noteCard}>
              <div className={styles.notePoster}>
                {note.poster_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${note.poster_path}`}
                    alt={note.title}
                    onClick={() => onOpen({ id: note.mediaId, media_type: note.mediaType, title: note.title })}
                  />
                ) : (
                  <div className={styles.posterPlaceholder}>
                    <i className="fas fa-film"></i>
                  </div>
                )}
              </div>
              
              <div className={styles.noteContent}>
                <h3 onClick={() => onOpen({ id: note.mediaId, media_type: note.mediaType, title: note.title })}>
                  {note.title || `Media ID: ${note.mediaId}`}
                </h3>
                
                {note.rating && (
                  <div className={styles.rating}>
                    <span className={styles.stars}>{getRatingStars(note.rating)}</span>
                    <span className={styles.ratingValue}>{note.rating}/10</span>
                  </div>
                )}
                
                {note.note && (
                  <p className={styles.noteText}>{note.note}</p>
                )}
                
                {note.isFavorite && (
                  <div className={styles.favoriteBadge}>
                    <i className="fas fa-heart"></i> Favorite
                  </div>
                )}
                
                <div className={styles.noteMeta}>
                  <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                  <button 
                    className={styles.deleteNoteBtn}
                    onClick={() => handleDeleteNote(note.mediaId, note.mediaType)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  // ✅ Render Library Content
  const renderLibraryContent = () => {
    if (loading) {
      return <p className={styles.loadingText}>Loading...</p>;
    }

    if (movies.length === 0) {
      return (
        <div className={styles.emptyState}>
          <h3>Your {activeTab} is empty!</h3>
          <p>Go explore and add some movies.</p>
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {movies.map((movie) => (
          <div key={movie._id} className={styles.cardWrapper}>
            <MovieCard 
              movie={movie} 
              onClick={() => onOpen(movie)} 
            />
            <button 
              className={styles.deleteBtn} 
              onClick={(e) => handleRemove(e, movie.id)}
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container" style={{ paddingTop: "120px", minHeight: "80vh" }}>
      
      {/* ✅ MAIN TABS - Library & Notes */}
      <div className={styles.mainTabs}>
        {["favorites", "watchlist", "history", "notes"].map((tab) => (
          <button
            key={tab}
            className={`${styles.mainTab} ${activeTab === tab ? styles.active : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'notes' ? (
              <>
                <i className="fas fa-pen"></i> Notes & Ratings
              </>
            ) : (
              tab.charAt(0).toUpperCase() + tab.slice(1)
            )}
          </button>
        ))}
      </div>

      {/* ✅ CONTENT AREA */}
      {activeTab === 'notes' ? (
        <>
          <h2 className={styles.heading}>
            <i className="fas fa-pen"></i> My Notes & Ratings
          </h2>
          {renderNotesContent()}
        </>
      ) : (
        <>
          <h2 className={styles.heading}>{activeTab.toUpperCase()}</h2>
          {renderLibraryContent()}
        </>
      )}
    </div>
  );
}