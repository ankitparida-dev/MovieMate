import React, { useEffect, useState } from 'react';
import Avatar from '../components/Avatar';
import FollowSystem from '../components/FollowSystem';
import { useAnalytics } from '../hooks/useAnalytics';
import styles from './Profile.module.css';

const Profile = ({ setPage }) => {
  const [user, setUser] = useState(null);
  const analytics = useAnalytics();

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser({ name: 'User', email: 'user@example.com' });
      }
    }
  }, []);

  const handleAvatarChange = () => {
    console.log('Avatar updated');
  };

  if (!user) {
    return (
      <div className={styles.loginPrompt}>
        <i className="fas fa-user-circle"></i>
        <h2>Please Login</h2>
        <button onClick={() => setPage('login')} className={styles.loginBtn}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>

        {/* HEADER */}
        <div className={styles.profileHeader}>
          <Avatar name={user.name} size="xlarge" onAvatarChange={handleAvatarChange} />
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <span className={styles.memberSince}>
            <i className="fas fa-calendar-alt"></i> Movie Enthusiast
          </span>
        </div>

        {/* STATS GRID */}
        <div className={styles.profileStats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🎬</div>
            <div>
              <h3>Movies Watched</h3>
              <p>{analytics.totalMovies}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div>
              <h3>Average Rating</h3>
              <p>{analytics.averageRating || 0}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>❤️</div>
            <div>
              <h3>Favorites</h3>
              <p>{analytics.favoriteCount}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📝</div>
            <div>
              <h3>Notes</h3>
              <p>{analytics.totalNotes}</p>
            </div>
          </div>
        </div>

        {/* INSIGHTS */}
        <div className={styles.insights}>
          <div className={styles.insightItem}>
            <i className="fas fa-fire"></i>
            <div>
              <strong>Favorite Genre</strong>
              <p>{analytics.favoriteGenre || 'N/A'}</p>
            </div>
          </div>

          <div className={styles.insightItem}>
            <i className="fas fa-calendar-day"></i>
            <div>
              <strong>Most Active Day</strong>
              <p>{analytics.mostActiveDay || 'N/A'}</p>
            </div>
          </div>

          <div className={styles.insightItem}>
            <i className="fas fa-chart-line"></i>
            <div>
              <strong>Completion Rate</strong>
              <p>{analytics.totalMovies > 0 ? Math.round((analytics.totalRatings / analytics.totalMovies) * 100) : 0}%</p>
            </div>
          </div>
        </div>

        {/* FOLLOW SYSTEM */}
        <div className={styles.followSection}>
          <FollowSystem username={user.name} />
        </div>

        {/* ACTIONS */}
        <div className={styles.profileActions}>
          <button className={styles.actionBtn} onClick={() => setPage('mynotes')}>
            <i className="fas fa-pen"></i> My Notes
          </button>

          <button className={styles.actionBtn} onClick={() => setPage('analytics')}>
            <i className="fas fa-chart-line"></i> Analytics
          </button>

          <button className={styles.actionBtn} onClick={() => setPage('library')}>
            <i className="fas fa-bookmark"></i> My Library
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;