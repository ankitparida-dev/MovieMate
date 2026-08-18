// backend/routes/authRoutes.js

const express = require('express');
const fs = require('fs');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');

const {
    register,
    login,
    googleAuth,
    refresh,
    logout
} = require('../controllers/authController');

// ============================================================
// ✅ PROFILE UPLOAD ROUTE
// ============================================================

router.post('/upload-profile', upload.single('image'), async (req, res) => {
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

        // Delete temp file
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
});

// ============================================================
// ✅ AUTH ROUTES
// ============================================================

// Register new user
router.post('/register', register);

// Login user (Email/Password - No OTP)
router.post('/login', login);

// Google Sign-In
router.post('/google', googleAuth);

// Refresh access token
router.post('/refresh', refresh);

// Logout user
router.post('/logout', logout);

// ============================================================
// ✅ TEST ROUTE (Development only - remove in production)
// ============================================================

if (process.env.NODE_ENV !== 'production') {
    router.get('/test', (req, res) => {
        res.json({
            success: true,
            message: 'Auth routes are working!',
            routes: {
                register: '/api/auth/register',
                login: '/api/auth/login',
                google: '/api/auth/google',
                refresh: '/api/auth/refresh',
                logout: '/api/auth/logout',
                upload: '/api/auth/upload-profile'
            }
        });
    });
}

module.exports = router;