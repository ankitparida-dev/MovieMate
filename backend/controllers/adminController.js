// backend/controllers/adminController.js

const User = require("../models/User");
const MovieList = require("../models/MovieList");
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
            recentActivity: []
        });

    } catch (error) {
        console.error('Get stats error:', error);
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
        console.error('Get users error:', error);
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

        res.json({
            success: true,
            message: user.isBanned ? "User banned" : "User unbanned",
            user
        });

    } catch (error) {
        console.error('Ban user error:', error);
        res.status(500).json({
            message: error.message
        });
    }
};

// ✅ Delete User (Permanent)
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
        try {
            await prisma.comment.deleteMany({
                where: { userId: id }
            });
        } catch (prismaError) {
            console.log("⚠️ Prisma comment deletion skipped:", prismaError.message);
        }

        // ❌ REMOVED: Report deletion

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
        console.error('Get comments error:', error);
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
        console.error('Delete comment error:', error);
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
        console.error('Get lists error:', error);
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
        console.error('Delete list error:', error);
        res.status(500).json({
            message: error.message
        });
    }
};

// ❌ REMOVED: Reports functions (getReports, resolveReport)

/* ===========================
   EXPORTS
=========================== */

module.exports = {
    getStats,
    getUsers,
    banUser,
    deleteUser,
    getComments,
    deleteComment,
    getLists,
    deleteList
    // ❌ Removed: getReports, resolveReport
};