const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
    getStats,

    getUsers,
    banUser,

    getComments,
    deleteComment,

    getLists,
    deleteList,

    getReports,
    resolveReport

} = require("../controllers/adminController");

router.use(auth, admin);

/* ===========================
   DASHBOARD
=========================== */

router.get("/stats", getStats);

/* ===========================
   USERS
=========================== */

router.get("/users", getUsers);

router.patch(
    "/users/:id/ban",
    banUser
);

/* ===========================
   COMMENTS
=========================== */

router.get(
    "/comments",
    getComments
);

router.delete(
    "/comments/:id",
    deleteComment
);

/* ===========================
   MOVIE LISTS
=========================== */

router.get(
    "/lists",
    getLists
);

router.delete(
    "/lists/:id",
    deleteList
);

/* ===========================
   REPORTS
=========================== */

router.get(
    "/reports",
    getReports
);

router.patch(
    "/reports/:id",
    resolveReport
);

module.exports = router;