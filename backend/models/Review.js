const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    userName: {
        type: String,
        required: true
    },

    mediaId: {
        type: Number,
        required: true
    },

    mediaType: {
        type: String,
        required: true
    },

    title: {
        type: String,
        default: "Movie Review"
    },

    content: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    spoiler: {
        type: Boolean,
        default: false
    },

    likes: {
        type: Number,
        default: 0
    },

    helpful: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
});

module.exports =
    mongoose.model(
        "Review",
        reviewSchema
    );