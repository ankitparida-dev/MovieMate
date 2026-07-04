const mongoose = require('mongoose');

const movieListSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    userName: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ''
    },

    movies: [
        {
            mediaId: Number,
            title: String,
            poster_path: String,
            mediaType: String,
            addedAt: Date
        }
    ],

    isPublic: {
        type: Boolean,
        default: true
    },

    likes: {
        type: Number,
        default: 0
    },

    views: {
        type: Number,
        default: 0
    },

    tags: {
        type: [String],
        default: []
    }
},
{
    timestamps: true
});

module.exports = mongoose.model(
    'MovieList',
    movieListSchema
);