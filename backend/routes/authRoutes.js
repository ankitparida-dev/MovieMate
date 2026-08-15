// backend/routes/authRoutes.js

const express = require('express');
const fs = require('fs');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');

// ✅ Import all auth controller functions
const {
    register,
    login,
    verifyOtp,
    resendOtp,
    refresh,
    logout
} = require('../controllers/authController');

// ============================================================
// ✅ PROFILE UPLOAD ROUTE
// ============================================================

router.post(
    '/upload-profile',
    upload.single('image'),
    async (req, res) => {
        try {
            const { userId } = req.body;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No image uploaded'
                });
            }

            const user = await User.findById(userId);

            if (!user) {
                // Delete uploaded file if user not found
                fs.unlink(req.file.path, (err) => {
                    if (err) console.warn('Failed to delete temp upload:', err.message);
                });
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'moviemate/profiles',
                use_filename: true,
                unique_filename: true,
                resource_type: 'image'
            });

            // Delete temp local file after upload
            fs.unlink(req.file.path, (err) => {
                if (err) console.warn('Failed to delete temp upload:', err.message);
            });

            // Update user profile image
            user.profileImage = result.secure_url;
            await user.save();

            res.json({
                success: true,
                message: 'Profile image uploaded successfully',
                imageUrl: result.secure_url
            });

        } catch (error) {
            console.error('Upload error:', error);
            
            // Clean up temp file on error
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.warn('Failed to delete temp upload:', err.message);
                });
            }

            res.status(500).json({
                success: false,
                message: error.message || 'Failed to upload image'
            });
        }
    }
);

// ============================================================
// ✅ AUTH ROUTES
// ============================================================

// Register new user
router.post('/register', register);

// Login user (sends OTP)
router.post('/login', login);

// Verify OTP and complete login
router.post('/verify-otp', verifyOtp);

// Resend OTP
router.post('/resend-otp', resendOtp);

// Refresh access token
router.post('/refresh', refresh);

// Logout user
router.post('/logout', logout);

// ============================================================
// ✅ TEST ROUTE (Development only - remove in production)
// ============================================================

if (process.env.NODE_ENV !== 'production') {
    router.get('/test-otp/:email', async (req, res) => {
        try {
            const user = await User.findOne({ email: req.params.email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            res.json({
                success: true,
                email: user.email,
                otpCode: user.otpCode,
                otpExpires: user.otpExpires,
                isAdmin: user.isAdmin || false,
                isBanned: user.isBanned || false
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });
}

// ============================================================
// ✅ EXPORT ROUTER
// ============================================================

module.exports = router;