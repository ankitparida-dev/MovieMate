import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
// 1. Import the remove function
import { getFavorites, getWatchlist, getHistory, removeFromCollection } from "../api/api";
import styles from "./MyLibrary.module.css";

export default function MyLibrary({ onOpen }) {
  const [activeTab, setActiveTab] = useState("favorites");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [activeTab]);

  // --- 2. HANDLE REMOVE ---
  const handleRemove = async (e, movieId) => {
    e.stopPropagation(); // Stop the card from opening the "About" page
    
    const confirmDelete = window.confirm("Remove this title from your library?");
    if (!confirmDelete) return;

    // Call API to delete
    await removeFromCollection(activeTab, movieId);

    // Remove from UI immediately (so you don't have to refresh)
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  return (
    <div className="container" style={{ paddingTop: "120px", minHeight: "80vh" }}>
      
      <div className={styles.tabs}>
        {["favorites", "watchlist", "history"].map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <h2 className={styles.heading}>{activeTab.toUpperCase()}</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : movies.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>Your {activeTab} is empty!</h3>
          <p>Go explore and add some movies.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {movies.map((movie) => (
            // 3. WRAPPER DIV FOR POSITIONING
            <div key={movie.id} className={styles.cardWrapper}>
              <MovieCard 
                movie={movie} 
                onClick={() => onOpen(movie)} 
              />
              
              {/* 4. THE DELETE BUTTON */}
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
      )}
    </div>
  );
}