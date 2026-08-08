const express = require('express');
const fs = require('fs');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');

const {
    register,
    login,
    verifyOtp,
    resendOtp,
    refresh,
    logout
} = require('../controllers/authController');

// Auth Routes
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
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'moviemate/profiles',
        use_filename: true,
        unique_filename: true,
        resource_type: 'image'
      });

      // delete temp local file after upload
      fs.unlink(req.file.path, (err) => {
        if (err) console.warn('Failed to delete temp upload:', err.message);
      });

      user.profileImage = result.secure_url;
      await user.save();

      res.json({
        success: true,
        imageUrl: result.secure_url
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;