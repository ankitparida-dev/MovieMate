// backend/controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

// ✅ Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

console.log('🔑 Google OAuth Configuration:');
console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Not Set');
console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Not Set');

// ============================================================
// ✅ TOKEN GENERATION
// ============================================================

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        {
            id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin || false,
            isBanned: user.isBanned || false
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

// ============================================================
// ✅ REGISTER
// ============================================================

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password required'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImage: '',
            isAdmin: false
        });

        // Socket notification
        const io = req.app.get('io');
        if (io) {
            io.emit('userActivity', {
                message: `New user registered: ${name} 🚀`
            });
        }

        res.status(201).json({
            success: true,
            message: 'Registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('REGISTER ERROR:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

// ============================================================
// ✅ LOGIN (Email/Password - No OTP)
// ============================================================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password required'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if banned
        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been banned. Please contact support.'
            });
        }

        // ✅ Generate tokens directly (No OTP)
        const { accessToken, refreshToken } = generateTokens(user);

        user.refreshToken = refreshToken;
        await user.save();

        // Socket notification
        const io = req.app.get('io');
        if (io) {
            io.emit('userActivity', {
                message: `${user.name} logged in 🎬`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin || false,
                isBanned: user.isBanned || false,
                profileImage: user.profileImage || '',
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

// ============================================================
// ✅ GOOGLE AUTHENTICATION
// ============================================================

const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Google token is required'
            });
        }

        // ✅ Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId, picture } = payload;

        console.log(`👤 Google user: ${email} (${name})`);

        // ✅ Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user from Google
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                googleId,
                profileImage: picture || '',
                password: null,
                isAdmin: false
            });
            console.log(`✅ New user created from Google: ${email}`);
        } else if (!user.googleId) {
            // Link existing account with Google
            user.googleId = googleId;
            if (picture) user.profileImage = picture;
            await user.save();
            console.log(`✅ Google linked to existing user: ${email}`);
        }

        // Check if banned
        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been banned. Please contact support.'
            });
        }

        // ✅ Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        user.refreshToken = refreshToken;
        await user.save();

        // Socket notification
        const io = req.app.get('io');
        if (io) {
            io.emit('userActivity', {
                message: `${user.name} logged in via Google 🎬`
            });
        }

        res.json({
            success: true,
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin || false,
                isBanned: user.isBanned || false,
                profileImage: user.profileImage || ''
            }
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(401).json({
            success: false,
            message: error.message || 'Invalid Google token'
        });
    }
};

// ============================================================
// ✅ REFRESH TOKEN
// ============================================================

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'No refresh token provided'
            });
        }

        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been banned.'
            });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin || false,
                isBanned: user.isBanned || false
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error('REFRESH ERROR:', error);
        res.status(403).json({
            success: false,
            message: 'Invalid or expired refresh token'
        });
    }
};

// ============================================================
// ✅ LOGOUT
// ============================================================

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            await User.findOneAndUpdate(
                { refreshToken },
                { refreshToken: null }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('LOGOUT ERROR:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
};

// ============================================================
// ✅ EXPORTS
// ============================================================

module.exports = {
    register,
    login,
    googleAuth,  // ✅ Google Sign-In
    refresh,
    logout
    // ❌ Removed: verifyOtp, resendOtp
};