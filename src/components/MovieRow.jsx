import React, { useState, useEffect } from 'react';
import styles from './MovieRow.module.css';
import MovieCard from './MovieCard'; // Your existing card component!
import { request } from '../api/tmdb'; // Your API helper

// A placeholder for the row while it's fetching
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

export default function MovieRow({ title, path, onOpen }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // This hook runs ONCE and re-runs if the 'path' prop ever changes
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // We fetch data using the 'path' prop
        const data = await request(path);
        setMovies(data.results ?? []);
      } catch (err) {
        console.error(`Failed to fetch ${title}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [path, title]); // Re-fetch if the path or title changes

  if (loading) {
    return <LoadingRow title={title} />;
  }

  // If the API fails or returns no movies, just show nothing
  if (movies.length === 0) {
    return null;
  }

  return (
    <section className={styles.contentSection}>
      <div className="container">
        <div className={styles.contentHeader}>
          <h2 className={styles.contentTitle}>{title}</h2>
          <a href="#" className={styles.contentLink} onClick={(e) => e.preventDefault()}>
            View All
            <i className="fas fa-chevron-right"></i>
          </a>
        </div>
        
        <div className={styles.contentGrid}>
          {/* This is the magic.
            We loop over the 'movies' state and render a MovieCard for each one.
          */}
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