import React, { useState } from 'react';
import { useSemanticSearch } from '../hooks/useSemanticSearch';
import styles from './SemanticSearch.module.css';

const SemanticSearch = () => {
  const { results, isSearching, handleSearch } = useSemanticSearch();
  const [inputValue, setInputValue] = useState('');

  const onSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(inputValue);
  };

  return (
    <div className={styles.searchContainer}>
      
      <div className={styles.header}>
        <h1>🧠 AI Semantic Search</h1>
        <p>Describe the movie you want to watch in plain English.</p>
      </div>

      <form className={styles.searchBar} onSubmit={onSearchSubmit}>
        <input 
          type="text" 
          className={styles.searchInput}
          placeholder="e.g., Movies about time travel with emotional endings..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      {isSearching && (
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Generating embeddings and searching vector database...</p>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className={styles.resultsGrid}>
          {results.map((movie) => (
            <div key={movie.id} className={styles.movieCard}>
              <img src={movie.poster} alt={movie.title} className={styles.moviePoster} />
              <div className={styles.movieInfo}>
                <h3 className={styles.movieTitle}>{movie.title}</h3>
                <div className={styles.movieMeta}>
                  {movie.year} • ⭐ {movie.rating}
                </div>
                <p className={styles.movieOverview}>{movie.overview}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isSearching && inputValue && results.length === 0 && (
        <div className={styles.emptyState}>
          No semantic matches found. Try a different description.
        </div>
      )}

    </div>
  );
};

export default SemanticSearch;