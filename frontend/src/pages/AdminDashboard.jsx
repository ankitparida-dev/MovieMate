// frontend/src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from "react";
import styles from "./AdminDashboard.module.css";

// ✅ API URL based on environment
const isProduction = typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1';

const API_BASE_URL = isProduction 
  ? "https://moviemate-l4ts.onrender.com/api/admin" 
  : "http://localhost:5000/api/admin";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [lists, setLists] = useState([]);
  const [comments, setComments] = useState([]);
  // ❌ REMOVED: const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLists: 0,
    totalComments: 0,
    // ❌ REMOVED: totalReports: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getHeaders();

      const [
        usersRes,
        listsRes,
        commentsRes,
        // ❌ REMOVED: reportsRes,
        statsRes
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/users`, { headers }),
        fetch(`${API_BASE_URL}/lists`, { headers }),
        fetch(`${API_BASE_URL}/comments`, { headers }),
        // ❌ REMOVED: fetch(`${API_BASE_URL}/reports`, { headers }),
        fetch(`${API_BASE_URL}/stats`, { headers })
      ]);

      if (!usersRes.ok || !listsRes.ok || !commentsRes.ok || !statsRes.ok) {
        throw new Error("Failed to fetch admin data");
      }

      const usersData = await usersRes.json();
      const listsData = await listsRes.json();
      const commentsData = await commentsRes.json();
      // ❌ REMOVED: const reportsData = await reportsRes.json();
      const statsData = await statsRes.json();

      setUsers(usersData);
      setLists(listsData);
      setComments(commentsData);
      // ❌ REMOVED: setReports(reportsData);

      setStats({
        totalUsers: statsData.totalUsers ?? usersData.length,
        totalLists: statsData.totalLists ?? listsData.length,
        totalComments: statsData.totalComments ?? commentsData.length,
        // ❌ REMOVED: totalReports: statsData.totalReports ?? reportsData.length,
        recentActivity: statsData.recentActivity ?? getRecentActivity(listsData, commentsData)
      });
    } catch (error) {
      console.error("Admin Dashboard Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRecentActivity = (lists, comments) => {
    const activities = [];
    lists.forEach(list => {
      activities.push({
        type: "list",
        userName: list.userName || "User",
        action: `created the list "${list.title}"`,
        time: list.createdAt
      });
    });
    comments.forEach(comment => {
      activities.push({
        type: "comment",
        userName: comment.username || "User",
        action: `commented on "${comment.movieTitle}"`,
        time: comment.createdAt
      });
    });
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);
  };

  // ✅ Delete List
  const deleteList = async (listId) => {
    if (!window.confirm("Delete this list?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!response.ok) throw new Error("Failed to delete list");
      loadData();
    } catch (error) {
      console.error("Delete list error:", error);
      alert("Failed to delete list");
    }
  };

  // ✅ Delete Comment
  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!response.ok) throw new Error("Failed to delete comment");
      loadData();
    } catch (error) {
      console.error("Delete comment error:", error);
      alert("Failed to delete comment");
    }
  };

  // ✅ Delete User
  const deleteUser = async (userId) => {
    if (!window.confirm("⚠️ Are you sure you want to permanently delete this user? This action cannot be undone!")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!response.ok) throw new Error("Failed to delete user");
      loadData();
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Failed to delete user");
    }
  };

  // ✅ Ban/Unban User
  const toggleBanUser = async (userId) => {
    if (!window.confirm("Toggle user's ban status?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/ban`, {
        method: "PATCH",
        headers: getHeaders()
      });
      if (!response.ok) throw new Error("Failed to ban/unban user");
      loadData();
    } catch (error) {
      console.error("Ban user error:", error);
      alert("Failed to ban/unban user");
    }
  };

  // ❌ REMOVED: resolveReport function

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <i className="fas fa-exclamation-triangle"></i>
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button className={styles.retryBtn} onClick={loadData}>
          <i className="fas fa-sync"></i> Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1>
          <i className="fas fa-shield-alt"></i>
          Admin Dashboard
        </h1>
        <p>Manage your MovieMate community</p>
      </div>

      {/* Stats - Removed Reports */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statInfo}>
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎬</div>
          <div className={styles.statInfo}>
            <h3>{stats.totalLists}</h3>
            <p>Movie Lists</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💬</div>
          <div className={styles.statInfo}>
            <h3>{stats.totalComments}</h3>
            <p>Comments</p>
          </div>
        </div>
        {/* ❌ REMOVED: Reports stat card */}
      </div>

      {/* Tabs - Removed Reports */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === "overview" ? styles.active : ""}`} onClick={() => setActiveTab("overview")}>
          <i className="fas fa-chart-pie"></i> Overview
        </button>
        <button className={`${styles.tab} ${activeTab === "users" ? styles.active : ""}`} onClick={() => setActiveTab("users")}>
          <i className="fas fa-users"></i> Users ({users.length})
        </button>
        <button className={`${styles.tab} ${activeTab === "lists" ? styles.active : ""}`} onClick={() => setActiveTab("lists")}>
          <i className="fas fa-list"></i> Lists
        </button>
        <button className={`${styles.tab} ${activeTab === "comments" ? styles.active : ""}`} onClick={() => setActiveTab("comments")}>
          <i className="fas fa-comment"></i> Comments
        </button>
        {/* ❌ REMOVED: Reports tab */}
      </div>

      {/* Tab Content - Removed Reports */}
      <div className={styles.tabContent}>
        {/* Overview Tab - Removed Reports quick action */}
        {activeTab === "overview" && (
          <div className={styles.overviewTab}>
            <div className={styles.recentActivity}>
              <h3><i className="fas fa-clock"></i> Recent Activity</h3>
              <div className={styles.activityList}>
                {stats.recentActivity.length === 0 ? (
                  <div className={styles.emptyState}>No recent activity</div>
                ) : (
                  stats.recentActivity.map((activity, index) => (
                    <div key={index} className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        {activity.type === "list" ? "🎬" : "💬"}
                      </div>
                      <div className={styles.activityContent}>
                        <span className={styles.activityUser}>{activity.userName}</span>
                        <span className={styles.activityAction}>{activity.action}</span>
                        <span className={styles.activityTime}>
                          {new Date(activity.time).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className={styles.quickActions}>
              <h3><i className="fas fa-bolt"></i> Quick Actions</h3>
              <div className={styles.actionGrid}>
                <button className={styles.actionBtn} onClick={() => setActiveTab("users")}>
                  <i className="fas fa-users-cog"></i> Manage Users
                </button>
                {/* ❌ REMOVED: View Reports button */}
                <button className={styles.actionBtn} onClick={loadData}>
                  <i className="fas fa-sync"></i> Refresh Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab - Unchanged */}
        {activeTab === "users" && (
          <div className={styles.usersTab}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="5" className={styles.emptyState}>No users found</td></tr>
                  ) : (
                    users.map(user => (
                      <tr key={user._id}>
                        <td className={styles.userCell}>
                          <div className={styles.userAvatar}>{user.name?.charAt(0)}</div>
                          <span>{user.name}</span>
                        </td>
                        <td>{user.email}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={user.isBanned ? styles.statusBanned : styles.statusActive}>
                            {user.isBanned ? "🚫 Banned" : "✅ Active"}
                          </span>
                        </td>
                        <td>
                          <button className={styles.banBtn} onClick={() => toggleBanUser(user._id)}>
                            <i className="fas fa-ban"></i> {user.isBanned ? "Unban" : "Ban"}
                          </button>
                          <button className={styles.deleteBtn} onClick={() => deleteUser(user._id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Lists Tab - Unchanged */}
        {activeTab === "lists" && (
          <div className={styles.listsTab}>
            {lists.length === 0 ? (
              <div className={styles.emptyState}>No movie lists yet</div>
            ) : (
              lists.map(list => (
                <div key={list._id} className={styles.listCard}>
                  <div className={styles.listHeader}>
                    <div className={styles.listUser}>
                      <div className={styles.avatarSmall}>{list.userName?.charAt(0) || "U"}</div>
                      <span className={styles.listUserName}>{list.userName}</span>
                    </div>
                    <span className={styles.listDate}>
                      {new Date(list.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className={styles.listTitle}>{list.title}</h4>
                  <p className={styles.listDescription}>{list.description || "No description"}</p>
                  <p className={styles.listMovies}>🎬 {list.movies?.length || 0} movies</p>
                  <button className={styles.deleteBtn} onClick={() => deleteList(list._id)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Comments Tab - Unchanged */}
        {activeTab === "comments" && (
          <div className={styles.commentsTab}>
            {comments.length === 0 ? (
              <div className={styles.emptyState}>No comments yet</div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentUser}>
                      <div className={styles.avatarSmall}>{comment.username?.charAt(0) || "U"}</div>
                      <span className={styles.commentUserName}>{comment.username}</span>
                    </div>
                    <span className={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={styles.commentText}>{comment.content}</p>
                  <button className={styles.deleteBtn} onClick={() => deleteComment(comment.id)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ❌ REMOVED: Reports Tab */}
      </div>
    </div>
  );
};

export default AdminDashboard;