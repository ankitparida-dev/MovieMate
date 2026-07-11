import { useState, useEffect } from "react";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [users, setUsers] = useState([]);
  const [lists, setLists] = useState([]);
  const [comments, setComments] = useState([]);
  const [reports, setReports] = useState([]);

const [stats, setStats] = useState({
    totalUsers: 0,
    totalLists: 0,
    totalComments: 0,
    totalReports: 0,
    recentActivity: []
});

useEffect(() => {
    loadData();
}, []);

const loadData = async () => {

    try {

        const token =
            localStorage.getItem("token");

        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        };

        const [
            usersRes,
            listsRes,
            commentsRes,
            reportsRes,
            statsRes
        ] = await Promise.all([

            fetch(
                "http://localhost:5000/api/admin/users",
                { headers }
            ),

            fetch(
                "http://localhost:5000/api/admin/lists",
                { headers }
            ),

            fetch(
                "http://localhost:5000/api/admin/comments",
                { headers }
            ),

            fetch(
                "http://localhost:5000/api/admin/reports",
                { headers }
            ),

            fetch(
                "http://localhost:5000/api/admin/stats",
                { headers }
            )

        ]);

        const usersData =
            usersRes.ok
                ? await usersRes.json()
                : [];

        const listsData =
            listsRes.ok
                ? await listsRes.json()
                : [];

        const commentsData =
            commentsRes.ok
                ? await commentsRes.json()
                : [];

        const reportsData =
            reportsRes.ok
                ? await reportsRes.json()
                : [];

        const statsData =
            statsRes.ok
                ? await statsRes.json()
                : {};

        setUsers(usersData);
        setLists(listsData);
        setComments(commentsData);
        setReports(reportsData);

        setStats({

            totalUsers:
                statsData.totalUsers ??
                usersData.length,

            totalLists:
                statsData.totalLists ??
                listsData.length,

            totalComments:
                statsData.totalComments ??
                commentsData.length,

            totalReports:
                statsData.totalReports ??
                reportsData.length,

            recentActivity:
                statsData.recentActivity ??
                getRecentActivity(
                    listsData,
                    commentsData
                )

        });

    }

    catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error
        );

    }

};

const getRecentActivity = (
    lists,
    comments
) => {

    const activities = [];

    lists.forEach(list => {

        activities.push({

            type: "list",

            userName:
                list.userName || "User",

            action:
                `created the list "${list.title}"`,

            time:
                list.createdAt

        });

    });

    comments.forEach(comment => {

        activities.push({

            type: "comment",

            userName:
                comment.username || "User",

            action:
                `commented on "${comment.movieTitle}"`,

            time:
                comment.createdAt

        });

    });

    return activities
        .sort(
            (a, b) =>
                new Date(b.time) -
                new Date(a.time)
        )
        .slice(0, 10);

};
const deleteList = async (listId) => {

    if (!window.confirm("Delete this list?"))
        return;

    try {

        const token =
            localStorage.getItem("token");

        await fetch(

            `http://localhost:5000/api/admin/lists/${listId}`,

            {

                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${token}`
                }

            }

        );

        loadData();

    }

    catch (error) {

        console.error(error);

    }

};

const deleteComment = async (id) => {

    if (!window.confirm("Delete this comment?"))
        return;

    try {

        const token =
            localStorage.getItem("token");

        await fetch(

            `http://localhost:5000/api/admin/comments/${id}`,

            {

                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${token}`
                }

            }

        );

        loadData();

    }

    catch (error) {

        console.error(error);

    }

};

const deleteUser = async (userId) => {

    if (!window.confirm("Toggle this user's ban status?"))
        return;

    try {

        const token =
            localStorage.getItem("token");

        await fetch(

            `http://localhost:5000/api/admin/users/${userId}/ban`,

            {

                method: "PATCH",

                headers: {
                    Authorization: `Bearer ${token}`
                }

            }

        );

        loadData();

    }

    catch (error) {

        console.error(error);

    }

};


 const resolveReport = async (id) => {

    if (!window.confirm("Mark this report as resolved?"))
        return;

    try {

        const token =
            localStorage.getItem("token");

        const response = await fetch(

            `http://localhost:5000/api/admin/reports/${id}`,

            {

                method: "PATCH",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    status: "resolved"
                })

            }

        );

        if (!response.ok) {
            throw new Error("Failed to resolve report");
        }

        await response.json();
        loadData();

    }

    catch (error) {

        console.error("Error resolving report:", error);
        alert("Failed to resolve report: " + error.message);

    }

};

return (
    <div className={styles.adminContainer}>

        {/* Header */}
        <div className={styles.header}>
            <h1>
                <i className="fas fa-shield-alt"></i>
                Admin Dashboard
            </h1>

            <p>
                Manage your MovieMate community
            </p>
        </div>

        {/* Stats */}
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
                className={`${styles.tab} ${activeTab === "overview" ? styles.active : ""}`}
                onClick={() => setActiveTab("overview")}
            >
                <i className="fas fa-chart-pie"></i>
                Overview
            </button>

            <button
                className={`${styles.tab} ${activeTab === "users" ? styles.active : ""}`}
                onClick={() => setActiveTab("users")}
            >
                <i className="fas fa-users"></i>
                Users
            </button>

            <button
                className={`${styles.tab} ${activeTab === "lists" ? styles.active : ""}`}
                onClick={() => setActiveTab("lists")}
            >
                <i className="fas fa-list"></i>
                Lists
            </button>

            <button
                className={`${styles.tab} ${activeTab === "comments" ? styles.active : ""}`}
                onClick={() => setActiveTab("comments")}
            >
                <i className="fas fa-comment"></i>
                Comments
            </button>

            <button
                className={`${styles.tab} ${activeTab === "reports" ? styles.active : ""}`}
                onClick={() => setActiveTab("reports")}
            >
                <i className="fas fa-flag"></i>
                Reports
            </button>

        </div>
     {/* Tab Content */}
<div className={styles.tabContent}>

  {/* Overview */}
  {activeTab === "overview" && (
    <div className={styles.overviewTab}>

      <div className={styles.recentActivity}>
        <h3>
          <i className="fas fa-clock"></i> Recent Activity
        </h3>

        <div className={styles.activityList}>

          {stats.recentActivity.length === 0 ? (

            <div className={styles.emptyState}>
              No recent activity
            </div>

          ) : (

            stats.recentActivity.map((activity, index) => (

              <div
                key={index}
                className={styles.activityItem}
              >

                <div className={styles.activityIcon}>
                  {activity.type === "list"
                    ? "🎬"
                    : "💬"}
                </div>

                <div className={styles.activityContent}>

                  <span className={styles.activityUser}>
                    {activity.userName}
                  </span>

                  <span className={styles.activityAction}>
                    {activity.action}
                  </span>

                  <span className={styles.activityTime}>
                    {new Date(
                      activity.time
                    ).toLocaleDateString()}
                  </span>

                </div>

              </div>

            ))

          )}

        </div>
      </div>

      <div className={styles.quickActions}>

        <h3>
          <i className="fas fa-bolt"></i>
          Quick Actions
        </h3>

        <div className={styles.actionGrid}>

          <button
            className={styles.actionBtn}
            onClick={() =>
              setActiveTab("users")
            }
          >
            <i className="fas fa-users-cog"></i>
            Manage Users
          </button>

          <button
            className={styles.actionBtn}
            onClick={() =>
              setActiveTab("reports")
            }
          >
            <i className="fas fa-flag"></i>
            View Reports
          </button>

          <button
            className={styles.actionBtn}
            onClick={loadData}
          >
            <i className="fas fa-sync"></i>
            Refresh Data
          </button>

        </div>

      </div>

    </div>
  )}

  {/* Users */}

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

              <tr>

                <td
                  colSpan="5"
                  className={styles.emptyState}
                >
                  No users found
                </td>

              </tr>

            ) : (

              users.map(user => (

                <tr key={user._id}>

                  <td className={styles.userCell}>

                    <div className={styles.userAvatar}>
                      {user.name?.charAt(0)}
                    </div>

                    <span>
                      {user.name}
                    </span>

                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td>

                    <span
                      className={
                        user.isBanned
                          ? styles.statusBanned
                          : styles.statusActive
                      }
                    >

                      {user.isBanned
                        ? "Banned"
                        : "Active"}

                    </span>

                  </td>

                  <td>

                    <button

                      className={styles.dangerBtn}

                      onClick={() =>
                        deleteUser(
                          user._id
                        )
                      }

                    >

                      <i className="fas fa-ban"></i>

                      {user.isBanned
                        ? " Unban"
                        : " Ban"}

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

               {/* Lists Tab */}
        {activeTab === "lists" && (
          <div className={styles.reviewsTab}>
            {lists.length === 0 ? (
              <div className={styles.emptyState}>
                No movie lists yet
              </div>
            ) : (
              lists.map(list => (
                <div
                  key={list._id}
                  className={styles.reviewCard}
                >
                  <div className={styles.reviewCardHeader}>
                    <div className={styles.reviewUser}>
                      <div className={styles.avatarSmall}>
                        {list.userName?.charAt(0) || "U"}
                      </div>

                      <span className={styles.reviewUserName}>
                        {list.userName}
                      </span>
                    </div>
                  </div>

                  <h4 className={styles.reviewTitle}>
                    {list.title}
                  </h4>

                  <p className={styles.reviewContent}>
                    {list.description || "No description"}
                  </p>

                  <p className={styles.reviewContent}>
                    🎬 {list.movies?.length || 0} movies
                  </p>

                  <div className={styles.reviewCardActions}>

                    <span className={styles.reviewDate}>
                      {new Date(
                        list.createdAt
                      ).toLocaleDateString()}
                    </span>

                    <button
                      className={styles.deleteBtn}
                      onClick={() =>
                        deleteList(list._id)
                      }
                    >
                      <i className="fas fa-trash"></i>
                      Delete
                    </button>

                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div className={styles.commentsTab}>
            {comments.length === 0 ? (
              <div className={styles.emptyState}>
                No comments yet
              </div>
            ) : (
              comments.map(comment => (
                <div
                  key={comment.id}
                  className={styles.commentItem}
                >
                  <div className={styles.commentHeader}>

                    <div className={styles.commentUser}>

                      <div className={styles.avatarSmall}>
                        {comment.username?.charAt(0) || "U"}
                      </div>

                      <span className={styles.commentUserName}>
                        {comment.username}
                      </span>

                    </div>

                    <span className={styles.commentDate}>
                      {new Date(
                        comment.createdAt
                      ).toLocaleDateString()}
                    </span>

                  </div>

                  <p className={styles.commentText}>
                    {comment.content}
                  </p>

                  <div className={styles.commentActions}>

                    <button
                      className={styles.deleteBtn}
                      onClick={() =>
                        deleteComment(comment.id)
                      }
                    >
                      <i className="fas fa-trash"></i>
                      Delete
                    </button>

                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className={styles.reportsTab}>

            {reports.length === 0 ? (

              <div className={styles.emptyState}>
                No reports 🎉
              </div>

            ) : (

              reports.map(report => (

                <div
                  key={report.id}
                  className={styles.reportItem}
                >

                  <div className={styles.reportHeader}>

                    <div className={styles.reportUser}>

                      <div className={styles.avatarSmall}>
                        {report.reporter?.charAt(0) || "R"}
                      </div>

                      <span className={styles.reportUserName}>
                        {report.reporter}
                      </span>

                    </div>

                    <span className={styles.reportDate}>
                      {new Date(
                        report.createdAt
                      ).toLocaleDateString()}
                    </span>

                  </div>

                  <p className={styles.reportReason}>
                    {report.reason}
                  </p>

                  <div className={styles.reportActions}>

                    <button
                      className={styles.resolveBtn}
                      onClick={() =>
                        resolveReport(report.id)
                      }
                    >
                      <i className="fas fa-check"></i>
                      Resolve
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