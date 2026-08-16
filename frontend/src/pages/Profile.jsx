// frontend/src/pages/Profile.jsx

import React, { useEffect, useState } from 'react';
import Avatar from '../components/Avatar';
import FollowSystem from '../components/FollowSystem';
import { useAnalytics } from '../hooks/useAnalytics';
import styles from './Profile.module.css';

const Profile = ({ setPage }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const analytics = useAnalytics();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('📝 User Data:', parsedUser);
        setUser(parsedUser);
      } catch (e) {
        setUser({ name: 'User', email: 'user@example.com' });
      }
    }
    setIsLoading(false);
  }, []);

  const handleAvatarChange = () => {
    setAvatarKey(Date.now());
    console.log('Avatar updated');
  };

  // ✅ Format join date
  const getJoinDate = (createdAt) => {
    if (!createdAt) return 'August 2025';
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    return `${month} ${day}, ${year}`;
  };

  // ✅ Get member since
  const getMemberSince = (createdAt) => {
    if (!createdAt) return '2025';
    return new Date(createdAt).getFullYear();
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loginPrompt}>
        <div className={styles.loginPromptContent}>
          <i className="fas fa-user-circle"></i>
          <h2>Welcome Back!</h2>
          <p>Please login to view your profile</p>
          <button onClick={() => setPage('login')} className={styles.loginBtn}>
            <i className="fas fa-sign-in-alt"></i> Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        
        {/* ✅ HEADER WITH COVER */}
        <div className={styles.profileHeader}>
          <div className={styles.coverImage}>
            <div className={styles.coverOverlay}></div>
          </div>
          
          <div className={styles.profileInfo}>
            <div className={styles.avatarWrapper}>
              <Avatar 
                key={avatarKey}
                name={user.name} 
                size="xlarge" 
                onAvatarChange={handleAvatarChange} 
              />
              <div className={styles.onlineStatus}>
                <span className={styles.statusDot}></span>
              </div>
            </div>
            
            <div className={styles.userDetails}>
              <h1>{user.name}</h1>
              <p className={styles.userEmail}>
                <i className="fas fa-envelope"></i> {user.email}
              </p>
              <div className={styles.userMeta}>
                <span className={styles.metaItem}>
                  <i className="fas fa-calendar-alt"></i> 
                  Joined {getMemberSince(user.createdAt)}
                </span>
                <span className={styles.metaItem}>
                  <i className="fas fa-film"></i> Movie Lover
                </span>
                <span className={styles.metaItem}>
                  <i className="fas fa-star"></i> 4.8 Avg Rating
                </span>
              </div>
              <div className={styles.joinDate}>
                <i className="fas fa-calendar-check"></i>
                Member since {getJoinDate(user.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ STATS GRID */}
        <div className={styles.profileStats}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ background: 'rgba(46, 196, 182, 0.15)' }}>
              <i className="fas fa-film" style={{ color: '#2ec4b6' }}></i>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{analytics.totalMovies || 0}</span>
              <span className={styles.statLabel}>Movies Watched</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ background: 'rgba(255, 193, 7, 0.15)' }}>
              <i className="fas fa-star" style={{ color: '#ffc107' }}></i>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{analytics.averageRating || 0}</span>
              <span className={styles.statLabel}>Avg Rating</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ background: 'rgba(255, 107, 107, 0.15)' }}>
              <i className="fas fa-heart" style={{ color: '#ff6b6b' }}></i>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{analytics.favoriteCount || 0}</span>
              <span className={styles.statLabel}>Favorites</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ background: 'rgba(46, 196, 182, 0.15)' }}>
              <i className="fas fa-pen" style={{ color: '#2ec4b6' }}></i>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{analytics.totalNotes || 0}</span>
              <span className={styles.statLabel}>Notes</span>
            </div>
          </div>
        </div>

        {/* ✅ INSIGHTS */}
        <div className={styles.insights}>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>
              <i className="fas fa-fire"></i>
            </div>
            <div className={styles.insightContent}>
              <span className={styles.insightLabel}>Favorite Genre</span>
              <span className={styles.insightValue}>{analytics.favoriteGenre || 'N/A'}</span>
            </div>
          </div>

          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>
              <i className="fas fa-calendar-day"></i>
            </div>
            <div className={styles.insightContent}>
              <span className={styles.insightLabel}>Most Active Day</span>
              <span className={styles.insightValue}>{analytics.mostActiveDay || 'N/A'}</span>
            </div>
          </div>

          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>
              <i className="fas fa-chart-line"></i>
            </div>
            <div className={styles.insightContent}>
              <span className={styles.insightLabel}>Completion Rate</span>
              <span className={styles.insightValue}>
                {analytics.totalMovies > 0 
                  ? Math.round((analytics.totalRatings / analytics.totalMovies) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* ✅ FOLLOW SYSTEM */}
        <div className={styles.followSection}>
          <div className={styles.sectionHeader}>
            <h3><i className="fas fa-users"></i> Community</h3>
            <span className={styles.sectionBadge}>Connect with others</span>
          </div>
          <FollowSystem username={user.name} />
        </div>

        {/* ✅ QUICK ACTIONS */}
        <div className={styles.profileActions}>
          <button className={styles.actionBtn} onClick={() => setPage('library')}>
            <i className="fas fa-bookmark"></i> My Library
          </button>
          <button className={styles.actionBtn} onClick={() => setPage('analytics')}>
            <i className="fas fa-chart-bar"></i> Analytics
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;