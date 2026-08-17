const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movieId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    poster_path: {
        type: String
    },
    category: {
        type: String,
        enum: ['favorites', 'watchlist', 'history'],
        required: true
    },
    watchStatus: {
        type: String,
        enum: ['planning', 'watching', 'completed'],
        default: 'planning'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Library', librarySchema);