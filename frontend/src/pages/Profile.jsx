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
        </div>

        {/* STATS GRID (NOW FULLY REAL) */}
        <div className={styles.profileStats}>

          <div className={styles.statCard}>
            <i className="fas fa-film"></i>
            <div>
              <h3>Movies Watched</h3>
              <p>{analytics.totalMovies}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <i className="fas fa-star"></i>
            <div>
              <h3>Total Ratings</h3>
              <p>{analytics.totalRatings}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <i className="fas fa-heart"></i>
            <div>
              <h3>Favorites</h3>
              <p>{analytics.favoriteCount}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <i className="fas fa-comment"></i>
            <div>
              <h3>Notes</h3>
              <p>{analytics.totalNotes}</p>
            </div>
          </div>

        </div>

        {/* FOLLOW SYSTEM */}
        <div className={styles.followSection}>
          <FollowSystem username={user.name} />
        </div>
        <div className={styles.profileStats}>

  <div className={styles.statCard}>
    <i className="fas fa-film"></i>
    <div>
      <h3>Movies Watched</h3>
      <p>{analytics.totalMovies}</p>
    </div>
  </div>

  <div className={styles.statCard}>
    <i className="fas fa-star"></i>
    <div>
      <h3>Average Rating</h3>
      <p>{analytics.averageRating}</p>
    </div>
  </div>

  <div className={styles.statCard}>
    <i className="fas fa-pen"></i>
    <div>
      <h3>Notes Written</h3>
      <p>{analytics.totalNotes}</p>
    </div>
  </div>

  <div className={styles.statCard}>
    <i className="fas fa-bullseye"></i>
    <div>
      <h3>Completion Rate</h3>
      <p>{analytics.totalMovies > 0 ? Math.round((analytics.totalRatings / analytics.totalMovies) * 100) : 0}%</p>
    </div>
  </div>

</div>

        {/* INSIGHTS (from analytics hook) */}
        <div className={styles.insights}>
          <div>
            <strong>Favorite Genre:</strong>
            <p>{analytics.favoriteGenre}</p>
          </div>

          <div>
            <strong>Most Active Day:</strong>
            <p>{analytics.mostActiveDay}</p>
          </div>

          <div>
            <strong>Completion Rate:</strong>
            <p>{analytics.totalMovies > 0 ? Math.round((analytics.totalRatings / analytics.totalMovies) * 100) : 0}%</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className={styles.profileActions}>
          <button onClick={() => setPage('mynotes')}>
            My Notes
          </button>

          <button onClick={() => setPage('analytics')}>
            Analytics
          </button>

          <button onClick={() => setPage('library')}>
            My Library
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;