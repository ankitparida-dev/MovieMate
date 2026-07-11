const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { createReport, getUserReports } = require("../controllers/reportController");

// Create a new report
router.post("/", auth, createReport);

// Get user's own reports
router.get("/user", auth, getUserReports);

module.exports = router;
