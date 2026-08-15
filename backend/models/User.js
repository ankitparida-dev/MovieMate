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

    otpCode: {
        type: String,
        default: null
    },

    otpExpires: {
        type: Date,
        default: null
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

// ✅ OPTIONAL: Add index for faster OTP queries
userSchema.index({ email: 1, otpCode: 1 });

module.exports = mongoose.model(
    'User',
    userSchema
);