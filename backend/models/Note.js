const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mediaId: {
        type: Number,
        required: true
    },
    mediaType: {
        type: String,
        enum: ['movie', 'tv'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    poster_path: {
        type: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    note: {
        type: String,
        maxLength: 500
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);