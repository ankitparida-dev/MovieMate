import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFollow } from "../hooks/useFollow";
import { createReport } from "../api/api";
import styles from "./FollowSystem.module.css";

// ✅ Check if the browser is running live on Vercel vs locally
const isProduction = typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1';

// ✅ Automatically choose the production Render domain vs local fallback
const API_URL = isProduction 
  ? "https://moviemate-l4ts.onrender.com/api/follow" 
  : "http://localhost:5000/api/follow";

const FollowSystem = () => {
    const {
        followUser,
        unfollowUser,
        isFollowing,
        getFollowStats
    } = useFollow();

    const [users, setUsers] = useState([]);

    const currentUser =
        JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReportUser = async (reportedUserId, reportedUserName) => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please sign in to report a user.");
            return;
        }

        const reason = prompt(`Why are you reporting ${reportedUserName}?`);
        if (!reason || !reason.trim()) {
            toast.error("Report reason is required.");
            return;
        }

        const description = prompt("Please provide a brief description:");
        if (!description || !description.trim()) {
            toast.error("Report description is required.");
            return;
        }

        try {
            await createReport(reportedUserId, reason.trim(), description.trim());
            toast.success("Report submitted successfully.");
        } catch (error) {
            console.error("Report failed:", error);
            toast.error(error.message || "Failed to submit report.");
        }
    };

    const stats = getFollowStats();

    return (
        <div className={styles.followContainer}>

            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <span className={styles.statNumber}>
                        {stats.followers}
                    </span>
                    <span className={styles.statLabel}>
                        Followers
                    </span>
                </div>

                <div className={styles.statItem}>
                    <span className={styles.statNumber}>
                        {stats.following}
                    </span>
                    <span className={styles.statLabel}>
                        Following
                    </span>
                </div>
            </div>

            <h3>Discover Users</h3>

            <div className={styles.userList}>

                {users
                    .filter(user => user._id !== currentUser.id)
                    .map(user => (

                        <div
                            key={user._id}
                            className={styles.userItem}
                        >

                            <div className={styles.userInfo}>

                                <div className={styles.avatar}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <div className={styles.userName}>
                                        {user.name}
                                    </div>

                                    <div className={styles.userStats}>
                                        {user.email}
                                    </div>
                                </div>

                            </div>

                            <div className={styles.userActions}>
                                {isFollowing(user._id) ? (
                                    <button
                                        className={styles.unfollowBtn}
                                        onClick={() => unfollowUser(user._id)}
                                    >
                                        Following
                                    </button>
                                ) : (
                                    <button
                                        className={styles.followBtn}
                                        onClick={() => followUser(user._id)}
                                    >
                                        Follow
                                    </button>
                                )}

                                <button
                                    className={styles.reportBtn}
                                    onClick={() => handleReportUser(user._id, user.name)}
                                >
                                    Report
                                </button>
                            </div>

                        </div>

                    ))}

            </div>

        </div>
    );
};

export default FollowSystem;