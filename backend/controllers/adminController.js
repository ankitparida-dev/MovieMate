import User from "../models/User.js";
import Review from "../models/Review.js";
import prisma from "../prisma/prisma.js";

export const getStats = async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalComments = await prisma.comment.count();

    res.json({
        totalUsers,
        totalReviews,
        totalComments
    });
};

export const getUsers = async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
};

export const getReviews = async (req, res) => {
    const reviews = await Review.find()
        .sort({ createdAt: -1 });

    res.json(reviews);
};

export const getComments = async (req, res) => {
    const comments = await prisma.comment.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    res.json(comments);
};

export const deleteReview = async (req, res) => {
    await Review.findByIdAndDelete(req.params.id);

    res.json({
        message: "Review deleted"
    });
};

export const deleteComment = async (req, res) => {
    await prisma.comment.delete({
        where: {
            id: Number(req.params.id)
        }
    });

    res.json({
        message: "Comment deleted"
    });
};
