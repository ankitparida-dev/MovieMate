import React, { useState, useEffect } from 'react';
import Avatar from '../components/Avatar';
import FollowSystem from '../components/FollowSystem';  // ✅ ADD THIS
import StatsDashboard from '../components/StatsDashboard';  // ✅ ADD THIS
import styles from './Profile.module.css';

const Profile = ({ setPage }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    moviesWatched: 0,
    totalRatings: 0,
    favorites: 0,
    comments: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser({ name: 'User', email: 'user@example.com' });
      }
    }
    
    // Load stats
    const notes = JSON.parse(localStorage.getItem('moviemate_movie_notes') || '[]');
    const comments = JSON.parse(localStorage.getItem('moviemate_comments') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    setStats({
      moviesWatched: notes.length,
      totalRatings: notes.filter(n => n.rating).length,
      favorites: notes.filter(n => n.isFavorite).length,
      comments: comments.filter(c => c.userName === currentUser.name).length
    });
  }, []);

  const handleAvatarChange = (newAvatar) => {
    console.log('Avatar updated');
  };

  if (!user) {
    return (
      <div className={styles.loginPrompt}>
        <i className="fas fa-user-circle"></i>
        <h2>Please Login</h2>
        <p>You need to be logged in to view your profile</p>
        <button onClick={() => setPage('login')} className={styles.loginBtn}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        {/* Header */}
        <div className={styles.profileHeader}>
          <Avatar 
            name={user.name} 
            size="xlarge" 
            onAvatarChange={handleAvatarChange}
          />
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <span className={styles.memberSince}>
            <i className="fas fa-calendar-alt"></i> Movie Enthusiast
          </span>
        </div>

        {/* Stats */}
        <div className={styles.profileStats}>
          <div className={styles.statCard}>
            <i className="fas fa-film"></i>
            <div>
              <h3>Movies Watched</h3>
              <p>{stats.moviesWatched}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <i className="fas fa-star"></i>
            <div>
              <h3>Total Ratings</h3>
              <p>{stats.totalRatings}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <i className="fas fa-heart"></i>
            <div>
              <h3>Favorites</h3>
              <p>{stats.favorites}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <i className="fas fa-comment"></i>
            <div>
              <h3>Comments</h3>
              <p>{stats.comments}</p>
            </div>
          </div>
        </div>

        {/* ✅ FOLLOW SYSTEM */}
        <div className={styles.followSection}>
          <FollowSystem username={user.name} />
        </div>

        {/* ✅ USER STATISTICS DASHBOARD */}
        <div className={styles.statsSection}>
          <StatsDashboard />
        </div>

        {/* Actions */}
        <div className={styles.profileActions}>
          <button onClick={() => setPage('mynotes')} className={styles.actionBtn}>
            <i className="fas fa-pen"></i> My Notes
          </button>
          <button onClick={() => setPage('analytics')} className={styles.actionBtn}>
            <i className="fas fa-chart-line"></i> Analytics
          </button>
          <button onClick={() => setPage('library')} className={styles.actionBtn}>
            <i className="fas fa-bookmark"></i> My Library
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;