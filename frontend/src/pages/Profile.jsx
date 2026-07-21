import React, { useEffect, useState } from 'react';
import Avatar from '../components/Avatar';
import FollowSystem from '../components/FollowSystem';
import { useAnalytics } from '../hooks/useAnalytics';
import styles from './Profile.module.css';

const Profile = ({ setPage }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(false);
  }, []);

  const handleAvatarChange = () => {
    console.log('Avatar updated');
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
            <div className={styles.coverBadge}>🎬 Movie Enthusiast</div>
          </div>
          
          <div className={styles.profileInfo}>
            <div className={styles.avatarWrapper}>
              <Avatar name={user.name} size="xlarge" onAvatarChange={handleAvatarChange} />
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
                  <i className="fas fa-calendar-alt"></i> Joined 2024
                </span>
                <span className={styles.metaItem}>
                  <i className="fas fa-film"></i> Movie Lover
                </span>
                <span className={styles.metaItem}>
                  <i className="fas fa-star"></i> 4.8 Avg Rating
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ STATS GRID WITH ICONS */}
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
              <span className={styles.statLabel}>Average Rating</span>
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

        {/* ✅ INSIGHTS CARDS */}
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

          <div className={styles.insightCard}>
            <div className={styles.insightIcon}>
              <i className="fas fa-clock"></i>
            </div>
            <div className={styles.insightContent}>
              <span className={styles.insightLabel}>Total Watch Time</span>
              <span className={styles.insightValue}>
                {analytics.totalWatchTime || '0h'}
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
          <button className={styles.actionBtn} onClick={() => setPage('mynotes')}>
            <i className="fas fa-pen"></i> My Notes
          </button>
          <button className={styles.actionBtn} onClick={() => setPage('analytics')}>
            <i className="fas fa-chart-bar"></i> Analytics
          </button>
          <button className={`${styles.actionBtn} ${styles.actionBtnOutline}`}>
            <i className="fas fa-cog"></i> Settings
          </button>
        </div>

        {/* ✅ STATS PROGRESS BAR */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span>Activity Level</span>
            <span className={styles.progressPercent}>78%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '78%' }}></div>
          </div>
          <div className={styles.progressLabels}>
            <span>Beginner</span>
            <span>Explorer</span>
            <span>Cinema Pro</span>
            <span>Legend</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;