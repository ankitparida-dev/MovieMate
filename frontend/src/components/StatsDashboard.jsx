import React from 'react';
import { useStats } from '../hooks/useStats';
import styles from './StatsDashboard.module.css';

const StatsDashboard = () => {
  const stats = useStats();

  return (
    <div className={styles.statsContainer}>
      <h2><i className="fas fa-chart-line"></i> Your Stats</h2>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎬</div>
          <div className={styles.statInfo}>
            <h3>{stats.totalMovies}</h3>
            <p>Movies Watched</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statInfo}>
            <h3>{stats.averageRating}</h3>
            <p>Average Rating</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statInfo}>
            <h3>{stats.totalReviews}</h3>
            <p>Reviews Written</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statInfo}>
            <h3>{stats.completionRate}%</h3>
            <p>Completion Rate</p>
          </div>
        </div>
      </div>

      <div className={styles.insights}>
        <div className={styles.insightItem}>
          <i className="fas fa-fire"></i>
          <div>
            <strong>Favorite Genre</strong>
            <p>{stats.favoriteGenre}</p>
          </div>
        </div>
        <div className={styles.insightItem}>
          <i className="fas fa-calendar-day"></i>
          <div>
            <strong>Most Active Day</strong>
            <p>{stats.mostActiveDay}</p>
          </div>
        </div>
        <div className={styles.insightItem}>
          <i className="fas fa-clock"></i>
          <div>
            <strong>Watch Time</strong>
            <p>{Math.round(stats.watchTime / 60)} hours</p>
          </div>
        </div>
      </div>

      {stats.topActors.length > 0 && (
        <div className={styles.topList}>
          <h3><i className="fas fa-users"></i> Top Actors</h3>
          <div className={styles.tagList}>
            {stats.topActors.map((actor, i) => (
              <span key={i} className={styles.tag}>{actor}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDashboard;