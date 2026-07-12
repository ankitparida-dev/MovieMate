import { useState, useEffect } from "react";

// ✅ Check if the browser is running live on Vercel vs locally
const isProduction = typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1';

// ✅ Automatically route to production Render domain vs local fallback
const API_URL = isProduction 
  ? "https://moviemate-l4ts.onrender.com/api/follow" 
  : "http://localhost:5000/api/follow";

export const useFollow = () => {
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const loadFollowers = async () => {
        if (!user.id) return;

        const response = await fetch(
            `${API_URL}/followers/${user.id}`
        );

        const data = await response.json();

        setFollowers(data);
    };

    const loadFollowing = async () => {
        if (!user.id) return;

        const response = await fetch(
            `${API_URL}/following/${user.id}`
        );

        const data = await response.json();

        setFollowing(data);
    };

    useEffect(() => {
        loadFollowers();
        loadFollowing();
    }, []);

    const followUser = async (userId) => {
        await fetch(
            `${API_URL}/${userId}`,
            {
                method: "POST",
                headers
            }
        );

        loadFollowers();
        loadFollowing();
    };

    const unfollowUser = async (userId) => {
        await fetch(
            `${API_URL}/${userId}`,
            {
                method: "DELETE",
                headers
            }
        );

        loadFollowers();
        loadFollowing();
    };

    const isFollowing = (userId) => {
        return following.some(
            f => f.following._id === userId
        );
    };

    const getFollowStats = () => ({
        followers: followers.length,
        following: following.length
    });

    return {
        followers,
        following,
        followUser,
        unfollowUser,
        isFollowing,
        getFollowStats
    };
};