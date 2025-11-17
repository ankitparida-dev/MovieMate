import React, { useState, useEffect } from 'react';
import styles from './MovieRow.module.css';
import MovieCard from './MovieCard';
import { request } from '../api/tmdb';

const LoadingRow = ({ title }) => (
  <section className={styles.contentSection}>
    <div className="container">
      <div className={styles.contentHeader}>
        <h2 className={styles.contentTitle}>{title}</h2>
      </div>
      <p className={styles.loadingText}>Loading...</p>
    </div>
  </section>
);

// 1. Add 'params' to the props (default to empty object)
export default function MovieRow({ title, path, params = {}, onOpen }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // 2. Pass 'params' to the request function
        // This allows the search query to actually reach the API
        const data = await request(path, params);
        setMovies(data.results ?? []);
      } catch (err) {
        console.error(`Failed to fetch ${title}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    // 3. Add stringified params to dependency array
    // This ensures the search re-runs when you type a new query
  }, [path, title, JSON.stringify(params)]); 

  if (loading) {
    return <LoadingRow title={title} />;
  }

  if (movies.length === 0) {
    // Optional: Show a "No results" message for search
    if (path.includes("search")) {
      return (
        <section className={styles.contentSection}>
          <div className="container">
             <h2 className={styles.contentTitle}>{title}</h2>
             <p style={{color: "#8892b0", marginTop: "20px"}}>No results found.</p>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className={styles.contentSection}>
      <div className="container">
        <div className={styles.contentHeader}>
          <h2 className={styles.contentTitle}>{title}</h2>
          {/* {!path.includes("search") && (
            <a href="#" className={styles.contentLink} onClick={(e) => e.preventDefault()}>
              View All
              <i className="fas fa-chevron-right"></i>
            </a>
          )} */}
        </div>
        
        <div className={styles.contentGrid}>
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onClick={() => onOpen(movie)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}