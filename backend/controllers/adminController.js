const User = require('../models/User');
const Review = require('../models/Review');

// Replace this with your actual Prisma import if needed
const prisma = require('../prisma/prisma');

const getStats = async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalComments = await prisma.comment.count();

    res.json({
        totalUsers,
        totalReviews,
        totalComments
    });
};

const getUsers = async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
};

const getReviews = async (req, res) => {
    const reviews = await Review.find()
        .sort({ createdAt: -1 });

    res.json(reviews);
};

const getComments = async (req, res) => {
    const comments = await prisma.comment.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    res.json(comments);
};

const deleteReview = async (req, res) => {
    await Review.findByIdAndDelete(req.params.id);

    res.json({
        message: 'Review deleted'
    });
};

const deleteComment = async (req, res) => {
    await prisma.comment.delete({
        where: {
            id: Number(req.params.id)
        }
    });

    res.json({
        message: 'Comment deleted'
    });
};

module.exports = {
    getStats,
    getUsers,
    getReviews,
    getComments,
    deleteReview,
    deleteComment
};