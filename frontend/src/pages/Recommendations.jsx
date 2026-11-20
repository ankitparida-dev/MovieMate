import React from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import styles from './Recommendations.module.css';

const Recommendations = () => {
  const { recommendations, isLoading } = useRecommendations();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🎯 Your Smart Picks</h1>
        <p>AI-driven recommendations based on your unique watch history.</p>
      </div>

      {isLoading ? (
        <div className={styles.skeletonContainer}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={styles.skeletonCard}></div>
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {recommendations.map((movie) => (
            <div key={movie.id} className={styles.card}>
              <img 
                src={movie.poster_path} 
                alt={movie.title} 
                className={styles.poster} 
              />
              
              <div className={styles.matchBadge}>
                {movie.matchScore}% Match
              </div>

              <div className={styles.info}>
                <h3 className={styles.title}>{movie.title}</h3>
                <div className={styles.meta}>
                  <span>⭐ {movie.vote_average}</span>
                  <span>{movie.release_date?.split('-')[0]}</span>
                </div>

                {/* Explainability Feature */}
                <div className={styles.reasonBox}>
                  <span className={styles.reasonLabel}>Why this?</span>
                  <p className={styles.reasonText}>"{movie.reason}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;