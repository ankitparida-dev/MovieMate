import { useState, useEffect } from 'react';

const STORAGE_KEY = 'moviemate_follows';

export const useFollow = () => {
  const [follows, setFollows] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setFollows(data);
        updateFollowStats(data);
      } catch (error) {
        console.error('Error loading follows:', error);
        setFollows([]);
      }
    }
  }, []);

  const updateFollowStats = (data) => {
    const user = JSON.parse(localStorage.getItem('user') || '{"name":"User"}');
    const userName = user.name || 'User';
    
    setFollowing(data.filter(f => f.follower === userName));
    setFollowers(data.filter(f => f.following === userName));
  };

  const saveFollows = (newFollows) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFollows));
    setFollows(newFollows);
    updateFollowStats(newFollows);
  };

  const followUser = (userName) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{"name":"User"}').name || 'User';
    
    if (currentUser === userName) {
      alert('You cannot follow yourself!');
      return;
    }

    const exists = follows.some(f => f.follower === currentUser && f.following === userName);
    if (!exists) {
      const newFollow = {
        id: Date.now(),
        follower: currentUser,
        following: userName,
        createdAt: new Date().toISOString()
      };
      saveFollows([...follows, newFollow]);
      return true;
    }
    return false;
  };

  const unfollowUser = (userName) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{"name":"User"}').name || 'User';
    const newFollows = follows.filter(f => !(f.follower === currentUser && f.following === userName));
    saveFollows(newFollows);
    return true;
  };

  const isFollowing = (userName) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{"name":"User"}').name || 'User';
    return follows.some(f => f.follower === currentUser && f.following === userName);
  };

  const getFollowStats = () => {
    return {
      following: following.length,
      followers: followers.length
    };
  };

  const getPopularUsers = () => {
    const userCount = {};
    follows.forEach(f => {
      userCount[f.following] = (userCount[f.following] || 0) + 1;
    });
    return Object.entries(userCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, followers: count }));
  };

  return {
    follows,
    following,
    followers,
    followUser,
    unfollowUser,
    isFollowing,
    getFollowStats,
    getPopularUsers
  };
};