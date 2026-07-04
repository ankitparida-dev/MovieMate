import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReviews: 0,
    totalComments: 0,
    totalReports: 0,
    recentActivity: []
  });

  // Load data from localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  try {
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    const [
      usersRes,
      reviewsRes,
      commentsRes,
      reportsRes,
      statsRes
    ] = await Promise.all([
      fetch('http://localhost:5000/api/admin/users', { headers }),
      fetch('http://localhost:5000/api/admin/reviews', { headers }),
      fetch('http://localhost:5000/api/admin/comments', { headers }),
      fetch('http://localhost:5000/api/admin/reports', { headers }),
      fetch('http://localhost:5000/api/admin/stats', { headers })
    ]);

    const usersData = usersRes.ok ? await usersRes.json() : [];
    const reviewsData = reviewsRes.ok ? await reviewsRes.json() : [];
    const commentsData = commentsRes.ok ? await commentsRes.json() : [];
    const reportsData = reportsRes.ok ? await reportsRes.json() : [];
    const statsData = statsRes.ok ? await statsRes.json() : {};

    setUsers(usersData);
    setReviews(reviewsData);
    setComments(commentsData);
    setReports(reportsData);

    setStats({
      totalUsers: statsData.totalUsers || usersData.length,
      totalReviews: statsData.totalReviews || reviewsData.length,
      totalComments: statsData.totalComments || commentsData.length,
      totalReports: statsData.totalReports || reportsData.length,
      recentActivity:
        statsData.recentActivity ||
        getRecentActivity(reviewsData, commentsData)
    });

  } catch (error) {
    console.error('Admin dashboard load failed:', error);
  }
};
  const getRecentActivity = (reviews, comments) => {
    const activities = [];
    
    reviews.forEach(r => {
      activities.push({
        type: 'review',
        userName: r.userName || 'User',
        action: `wrote a review for "${r.title}"`,
        time: r.createdAt || new Date().toISOString(),
        rating: r.rating
      });
    });

    comments.forEach(c => {
      activities.push({
        type: 'comment',
        userName: c.userName || 'User',
        action: `commented on "${c.movieTitle || 'a movie'}"`,
        time: c.createdAt || new Date().toISOString()
      });
    });

    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
  };

const deleteReview = async (id) => {
  if (!window.confirm('Delete this review?')) return;

  try {
    const token = localStorage.getItem('token');

    await fetch(
      `http://localhost:5000/api/admin/reviews/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    loadData();
  } catch (error) {
    console.error(error);
  }
};

const deleteComment = async (id) => {
  if (!window.confirm('Delete this comment?')) return;

  try {
    const token = localStorage.getItem('token');

    await fetch(
      `http://localhost:5000/api/admin/comments/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    loadData();
  } catch (error) {
    console.error(error);
  }
};
  const deleteUser = async (userId) => {
  if (!window.confirm('Ban this user?')) return;

  try {
    const token = localStorage.getItem('token');

    await fetch(
      `http://localhost:5000/api/admin/users/${userId}/ban`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    loadData();
  } catch (error) {
    console.error(error);
  }
};

  const resolveReport = async (id) => {
  try {
    const token = localStorage.getItem('token');

    await fetch(
      `http://localhost:5000/api/admin/reports/${id}/resolve`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    loadData();
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <h1>
          <i className="fas fa-shield-alt"></i>
          Admin Dashboard
        </h1>
        <p>Manage your MovieMate community</p>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statInfo}>
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statInfo}>
            <h3>{stats.totalReviews}</h3>
            <p>Reviews</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💬</div>
          <div className={styles.statInfo}>
            <h3>{stats.totalComments}</h3>
            <p>Comments</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🚩</div>
          <div className={styles.statInfo}>
            <h3>{stats.totalReports}</h3>
            <p>Reports</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-chart-pie"></i> Overview
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <i className="fas fa-users"></i> Users
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'reviews' ? styles.active : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <i className="fas fa-star"></i> Reviews
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'comments' ? styles.active : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          <i className="fas fa-comment"></i> Comments
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'reports' ? styles.active : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <i className="fas fa-flag"></i> Reports
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className={styles.overviewTab}>
            <div className={styles.recentActivity}>
              <h3>
                <i className="fas fa-clock"></i> Recent Activity
              </h3>
              <div className={styles.activityList}>
                {stats.recentActivity.length === 0 ? (
                  <div className={styles.emptyState}>No recent activity</div>
                ) : (
                  stats.recentActivity.map((activity, index) => (
                    <div key={index} className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        {activity.type === 'review' ? '⭐' : '💬'}
                      </div>
                      <div className={styles.activityContent}>
                        <span className={styles.activityUser}>{activity.userName}</span>
                        <span className={styles.activityAction}>{activity.action}</span>
                        {activity.rating && (
                          <span className={styles.activityRating}>⭐ {activity.rating}/5</span>
                        )}
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
                <button className={styles.actionBtn} onClick={() => setActiveTab('users')}>
                  <i className="fas fa-users-cog"></i> Manage Users
                </button>
                <button className={styles.actionBtn} onClick={() => setActiveTab('reports')}>
                  <i className="fas fa-flag"></i> View Reports
                </button>
                <button className={styles.actionBtn} onClick={() => window.location.reload()}>
                  <i className="fas fa-sync"></i> Refresh Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
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
                    <tr>
                      <td colSpan="5" className={styles.emptyState}>No users found</td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={index}>
                        <td className={styles.userCell}>
                          <div className={styles.userAvatar}>
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <span>{user.name || 'User'}</span>
                        </td>
                        <td>{user.email || 'user@example.com'}</td>
                        <td>{new Date().toLocaleDateString()}</td>
                        <td>
                          <span className={styles.statusActive}>Active</span>
                        </td>
                        <td>
                          <button 
                            className={styles.dangerBtn}
                            onClick={() => deleteUser(user.id)}
                          >
                            <i className="fas fa-ban"></i> Ban
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

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className={styles.reviewsTab}>
            {reviews.length === 0 ? (
              <div className={styles.emptyState}>No reviews yet</div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewCardHeader}>
                    <div className={styles.reviewUser}>
                      <div className={styles.avatarSmall}>
                        {review.userName?.charAt(0) || 'U'}
                      </div>
                      <span className={styles.reviewUserName}>{review.userName}</span>
                    </div>
                    <div className={styles.reviewRating}>
                      {'⭐'.repeat(Math.floor(review.rating))}
                      <span>{review.rating}/5</span>
                    </div>
                  </div>
                  <h4 className={styles.reviewTitle}>{review.title}</h4>
                  <p className={styles.reviewContent}>{review.content}</p>
                  <div className={styles.reviewCardActions}>
                    <span className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => deleteReview(review.id)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className={styles.commentsTab}>
            {comments.length === 0 ? (
              <div className={styles.emptyState}>No comments yet</div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentUser}>
                      <div className={styles.avatarSmall}>
                        {comment.userName?.charAt(0) || 'U'}
                      </div>
                      <span className={styles.commentUserName}>{comment.userName}</span>
                    </div>
                    <span className={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={styles.commentText}>{comment.text}</p>
                  <div className={styles.commentActions}>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => deleteComment(comment.id)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className={styles.reportsTab}>
            {reports.length === 0 ? (
              <div className={styles.emptyState}>No reports</div>
            ) : (
              reports.map(report => (
                <div key={report.id} className={styles.reportItem}>
                  <div className={styles.reportHeader}>
                    <div className={styles.reportUser}>
                      <div className={styles.avatarSmall}>
                        {report.reporter?.charAt(0) || 'R'}
                      </div>
                      <span className={styles.reportUserName}>{report.reporter || 'Anonymous'}</span>
                      <span className={styles.reportType}>reported</span>
                      <span className={styles.reportTarget}>{report.targetUser}</span>
                    </div>
                    <span className={styles.reportDate}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={styles.reportReason}>
                    <strong>Reason:</strong> {report.reason}
                  </p>
                  <div className={styles.reportActions}>
                    <button 
                      className={styles.resolveBtn}
                      onClick={() => resolveReport(report.id)}
                    >
                      <i className="fas fa-check"></i> Resolve
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => resolveReport(report.id)}
                    >
                      <i className="fas fa-trash"></i> Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;