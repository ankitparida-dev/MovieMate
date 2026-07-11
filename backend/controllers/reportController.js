const Report = require("../models/Report");
const User = require("../models/User");

// Create a new report
const createReport = async (req, res) => {
  try {
    const { reason, description, reportedUserId, reportedUser } = req.body;
    const reporterId = req.user.id;

    if (!reason || !description) {
      return res.status(400).json({
        success: false,
        message: "Reason and description are required"
      });
    }

    const reporter = await User.findById(reporterId);

    const report = await Report.create({
      reporterId,
      reporter: reporter.name,
      reportedUserId,
      reportedUser,
      reason,
      description,
      status: "pending"
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit report",
      error: error.message
    });
  }
};

// Get user's own reports
const getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporterId: req.user.id })
      .populate("reportedUserId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message
    });
  }
};

module.exports = {
  createReport,
  getUserReports
};
