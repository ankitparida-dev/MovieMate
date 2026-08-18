// backend/routes/adminRoutes.js

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
    getStats,
    getUsers,
    banUser,
    deleteUser,
    getComments,
    deleteComment,
    getLists,
    deleteList
    // ❌ REMOVED: getReports, resolveReport
} = require("../controllers/adminController");

// ✅ All routes require authentication AND admin privileges
router.use(auth, admin);

/* ===========================
   DASHBOARD STATS
=========================== */

router.get("/stats", getStats);

/* ===========================
   USERS MANAGEMENT
=========================== */

// Get all users
router.get("/users", getUsers);

// Ban/Unban a user
router.patch("/users/:id/ban", banUser);

// ✅ Permanently delete a user and all associated data
router.delete("/users/:id", deleteUser);

/* ===========================
   COMMENTS MANAGEMENT
=========================== */

// Get all comments
router.get("/comments", getComments);

// Delete a comment
router.delete("/comments/:id", deleteComment);

/* ===========================
   MOVIE LISTS MANAGEMENT
=========================== */

// Get all movie lists
router.get("/lists", getLists);

// Delete a movie list
router.delete("/lists/:id", deleteList);

/* ===========================
   ❌ REPORTS MANAGEMENT (REMOVED)
=========================== */

module.exports = router;