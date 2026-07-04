const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        default: "User"
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    profileImage: {
        type: String,
        default: ""
    },

    refreshToken: {
        type: String,
        default: ""
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    isBanned: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model(
    'User',
    userSchema
);