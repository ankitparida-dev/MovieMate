const User = require("../models/User");
const MovieList = require("../models/MovieList");
const Report = require("../models/Report");

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

        const users =
            await User.find()
                .select("-password");

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const banUser = async (req, res) => {
    try {

        const user =
            await User.findById(req.params.id);

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

/* ===========================
   COMMENTS (Neon / Prisma)
=========================== */

const getComments = async (req, res) => {
    try {

        const comments =
            await prisma.comment.findMany({

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

        const lists =
            await MovieList.find()
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

        await MovieList.findByIdAndDelete(
            req.params.id
        );

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

    getComments,

    deleteComment,

    getLists,

    deleteList,

    getReports,

    resolveReport

};