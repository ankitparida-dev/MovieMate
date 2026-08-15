// backend/controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// ============================================================
// ✅ GMAIL SMTP TRANSPORTER
// ============================================================

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// ✅ Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP error:', error.message);
    } else {
        console.log('✅ SMTP ready to send emails');
    }
});

// ============================================================
// ✅ SEND OTP EMAIL
// ============================================================

const sendOtpEmail = async (email, otp) => {
    console.log(`📧 Sending OTP to ${email} via Gmail SMTP...`);

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || `MovieMate <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your MovieMate Verification Code',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background: #0a192f; color: #fff; padding: 20px; }
                        .container { max-width: 500px; margin: 0 auto; background: #112240; padding: 30px; border-radius: 12px; border: 1px solid #2ec4b6; }
                        .logo { text-align: center; font-size: 28px; color: #2ec4b6; font-weight: bold; }
                        .otp { font-size: 42px; font-weight: bold; color: #2ec4b6; text-align: center; padding: 20px; letter-spacing: 12px; background: #0a192f; border-radius: 8px; margin: 20px 0; border: 1px solid rgba(46,196,182,0.2); }
                        .expiry { text-align: center; color: #8892b0; font-size: 14px; }
                        .footer { text-align: center; color: #8892b0; font-size: 12px; margin-top: 20px; border-top: 1px solid rgba(46,196,182,0.1); padding-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo">🎬 MOVIEMATE</div>
                        <p style="text-align:center; color:#e6e6e6;">Your verification code is:</p>
                        <div class="otp">${otp}</div>
                        <div class="expiry">⏱️ This code expires in <strong>10 minutes</strong></div>
                        <div class="footer">— MovieMate Team</div>
                    </div>
                </body>
                </html>
            `
        });
        console.log(`✅ OTP sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Email error:', error.message);
        throw error;
    }
};

// ============================================================
// ✅ OTP GENERATION
// ============================================================

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

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

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

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
                email: user.email
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
// ✅ LOGIN (Send OTP in background - non-blocking)
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

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate OTP
        const otpCode = generateOtp();
        user.otpCode = otpCode;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        console.log(`🔐 OTP generated for ${email}: ${otpCode}`);

        // ✅ Send OTP in background (don't wait for email to finish)
        sendOtpEmail(user.email, otpCode)
            .then(() => console.log(`✅ OTP sent to ${email}`))
            .catch(err => console.error(`❌ Failed to send OTP to ${email}:`, err.message));

        // ✅ Respond immediately to user
        res.status(200).json({
            success: true,
            otpRequired: true,
            message: 'OTP sent to your email',
            email: user.email
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
// ✅ VERIFY OTP
// ============================================================

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP code are required'
            });
        }

        const user = await User.findOne({ email });
        if (!user || !user.otpCode) {
            return res.status(401).json({
                success: false,
                message: 'Invalid OTP or email'
            });
        }

        // Check expiry
        if (!user.otpExpires || user.otpExpires < new Date()) {
            user.otpCode = null;
            user.otpExpires = null;
            await user.save();
            return res.status(401).json({
                success: false,
                message: 'OTP has expired. Please request a new code.'
            });
        }

        // Check OTP match
        if (user.otpCode !== otp) {
            return res.status(401).json({
                success: false,
                message: 'Invalid OTP code'
            });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        user.refreshToken = refreshToken;
        user.otpCode = null;
        user.otpExpires = null;
        await user.save();

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
                profileImage: user.profileImage || ''
            }
        });

    } catch (error) {
        console.error('VERIFY OTP ERROR:', error);
        res.status(500).json({
            success: false,
            message: 'OTP verification failed',
            error: error.message
        });
    }
};

// ============================================================
// ✅ RESEND OTP
// ============================================================

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check cooldown (30 seconds)
        if (user.otpExpires) {
            const timeSinceLastOTP = Date.now() - (user.otpExpires.getTime() - 10 * 60 * 1000);
            if (timeSinceLastOTP < 30000) {
                return res.status(429).json({
                    success: false,
                    message: 'Please wait 30 seconds before requesting a new OTP'
                });
            }
        }

        const otpCode = generateOtp();
        user.otpCode = otpCode;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        console.log(`🔄 New OTP for ${email}: ${otpCode}`);

        // ✅ Send OTP in background
        sendOtpEmail(user.email, otpCode)
            .then(() => console.log(`✅ New OTP sent to ${email}`))
            .catch(err => console.error(`❌ Failed to send new OTP to ${email}:`, err.message));

        res.status(200).json({
            success: true,
            message: 'A new OTP code was sent to your email'
        });

    } catch (error) {
        console.error('RESEND OTP ERROR:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resend OTP',
            error: error.message
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
    verifyOtp,
    resendOtp,
    refresh,
    logout
};