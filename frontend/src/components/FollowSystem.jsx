import React, { useState } from 'react';
import { useFollow } from '../hooks/useFollow';
import styles from './FollowSystem.module.css';

const FollowSystem = ({ username }) => {
  const { followUser, unfollowUser, isFollowing, getFollowStats, getPopularUsers } = useFollow();
  const [activeTab, setActiveTab] = useState('suggestions');

  const stats = getFollowStats();
  const popularUsers = getPopularUsers();

  const handleFollowToggle = (user) => {
    if (isFollowing(user)) {
      unfollowUser(user);
    } else {
      followUser(user);
    }
  };

  return (
    <div className={styles.followContainer}>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{stats.following}</span>
          <span className={styles.statLabel}>Following</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{stats.followers}</span>
          <span className={styles.statLabel}>Followers</span>
        </div>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'suggestions' ? styles.active : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          Suggestions
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'following' ? styles.active : ''}`}
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
      </div>

      <div className={styles.userList}>
        {activeTab === 'suggestions' && (
          popularUsers.length === 0 ? (
            <div className={styles.emptyState}>No suggestions</div>
          ) : (
            popularUsers.map((user, index) => (
              <div key={index} className={styles.userItem}>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>{user.name[0]}</div>
                  <div>
                    <div className={styles.userName}>{user.name}</div>
                    <div className={styles.userStats}>{user.followers} followers</div>
                  </div>
                </div>
                <button 
                  className={isFollowing(user.name) ? styles.unfollowBtn : styles.followBtn}
                  onClick={() => handleFollowToggle(user.name)}
                >
                  {isFollowing(user.name) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default FollowSystem;