// backend/controllers/adminController.js

const User = require("../models/User");
const MovieList = require("../models/MovieList");
const Report = require("../models/Report");
const Library = require("../models/Library");
const Note = require("../models/Note");

// Prisma Client
const prisma = require("../prisma/prisma");

/* ===========================
   DASHBOARD STATS
=========================== */

const getStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalComments,
            totalLists
        ] = await Promise.all([
            User.countDocuments(),
            prisma.comment.count(),
            MovieList.countDocuments()
        ]);

        res.json({
            totalUsers,
            totalComments,
            totalLists,
            totalReports: 0,
            recentActivity: []
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/* ===========================
   USERS
=========================== */

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const banUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isBanned = !user.isBanned;
        await user.save();

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// ✅ NEW: Delete User (Permanent)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent deleting admin users
        if (user.isAdmin) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete an admin user"
            });
        }

        // Delete user's library
        await Library.deleteMany({ userId: id });

        // Delete user's notes
        await Note.deleteMany({ userId: id });

        // Delete user's movie lists
        await MovieList.deleteMany({ userId: id });

        // Delete user's comments (Prisma)
        await prisma.comment.deleteMany({
            where: { userId: id }
        });

        // Delete user's reports
        await Report.deleteMany({ reporterId: id });

        // Delete the user
        await User.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "User and all associated data deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ===========================
   COMMENTS (Neon / Prisma)
=========================== */

const getComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json(comments);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        await prisma.comment.delete({
            where: {
                id: req.params.id
            }
        });

        res.json({
            message: "Comment deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/* ===========================
   MOVIE LISTS
=========================== */

const getLists = async (req, res) => {
    try {
        const lists = await MovieList.find()
            .sort({ createdAt: -1 });

        res.json(lists);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteList = async (req, res) => {
    try {
        await MovieList.findByIdAndDelete(req.params.id);

        res.json({
            message: "List deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/* ===========================
   REPORTS
=========================== */

const getReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate("reporterId", "name email")
            .populate("reportedUserId", "name email")
            .sort({ createdAt: -1 });

        res.json(reports);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const resolveReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { status = "resolved", resolution = "Resolved by admin" } = req.body || {};

        const report = await Report.findById(id);

        if (!report) {
            return res.status(404).json({
                message: "Report not found"
            });
        }

        report.status = status;
        report.resolution = resolution;
        report.resolvedBy = req.user.id;
        report.resolvedAt = new Date();

        await report.save();

        res.json({
            message: "Report resolved",
            report
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/* ===========================
   EXPORTS
=========================== */

module.exports = {
    getStats,
    getUsers,
    banUser,
    deleteUser, // ✅ NEW
    getComments,
    deleteComment,
    getLists,
    deleteList,
    getReports,
    resolveReport
};