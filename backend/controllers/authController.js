// backend/controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const brevo = require('@getbrevo/brevo');

// ============================================================
// ✅ BREVO CONFIGURATION - FIXED
// ============================================================

// ✅ Try different import methods
const TransactionalEmailsApi = brevo.TransactionalEmailsApi || brevo.TransactionalEmailsApi;
const SendSmtpEmail = brevo.SendSmtpEmail || brevo.SendSmtpEmail;

const brevoApi = new TransactionalEmailsApi();
brevoApi.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey || brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

console.log('📧 Brevo Configuration:');
console.log('API Key:', process.env.BREVO_API_KEY ? '✅ Set' : '❌ Not Set');
console.log('Sender Email:', process.env.BREVO_SENDER_EMAIL || '❌ Not Set');

// ============================================================
// ✅ SEND OTP EMAIL VIA BREVO
// ============================================================

const sendOtpEmail = async (email, otp) => {
    console.log(`📧 Sending OTP to ${email} via Brevo...`);

    const sender = {
        email: process.env.BREVO_SENDER_EMAIL || 'ankitparida386@gmail.com',
        name: process.env.BREVO_SENDER_NAME || 'MovieMate'
    };

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; background: #0a192f; color: #fff; padding: 20px; margin: 0; }
                .container { max-width: 500px; margin: 0 auto; background: #112240; padding: 30px; border-radius: 12px; border: 1px solid #2ec4b6; }
                .logo { text-align: center; font-size: 28px; color: #2ec4b6; font-weight: bold; }
                .logo span { color: #ffffff; }
                .message { text-align: center; color: #e6e6e6; font-size: 16px; margin-bottom: 10px; }
                .otp { font-size: 42px; font-weight: bold; color: #2ec4b6; text-align: center; padding: 20px; letter-spacing: 12px; background: #0a192f; border-radius: 8px; margin: 20px 0; border: 1px solid rgba(46,196,182,0.2); }
                .expiry { text-align: center; color: #8892b0; font-size: 14px; }
                .footer { text-align: center; color: #8892b0; font-size: 12px; margin-top: 20px; border-top: 1px solid rgba(46,196,182,0.1); padding-top: 20px; }
                .warning { color: #e63946; font-size: 13px; text-align: center; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">🎬 <span>MOVIEMATE</span></div>
                <div class="message">Your One-Time Password (OTP) is:</div>
                <div class="otp">${otp}</div>
                <div class="expiry">⏱️ This code expires in <strong>10 minutes</strong></div>
                <div class="warning">⚠️ If you didn't request this, please ignore this email.</div>
                <div class="footer">— MovieMate Team • Secure Authentication</div>
            </div>
        </body>
        </html>
    `;

    try {
        const sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.to = [{ email }];
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.subject = 'Your MovieMate Verification Code';
        sendSmtpEmail.htmlContent = html;

        const response = await brevoApi.sendTransacEmail(sendSmtpEmail);
        console.log(`✅ OTP sent successfully to ${email}`);
        console.log(`📧 Brevo Response:`, response.response?.statusCode || 'OK');
        return true;

    } catch (error) {
        console.error('❌ Brevo error:');
        console.error('Message:', error.message);
        if (error.response) {
            console.error('Response:', error.response);
        }
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
// ✅ LOGIN
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

        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been banned. Please contact support.'
            });
        }

        const otpCode = generateOtp();
        user.otpCode = otpCode;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        console.log(`🔐 OTP generated for ${email}: ${otpCode}`);

        try {
            await sendOtpEmail(user.email, otpCode);
            console.log(`✅ OTP sent successfully to ${email}`);
        } catch (emailError) {
            console.error('❌ Failed to send OTP:', emailError.message);
        }

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

        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been banned. Please contact support.'
            });
        }

        if (!user.otpExpires || user.otpExpires < new Date()) {
            user.otpCode = null;
            user.otpExpires = null;
            await user.save();
            return res.status(401).json({
                success: false,
                message: 'OTP has expired. Please request a new code.'
            });
        }

        if (user.otpCode !== otp) {
            return res.status(401).json({
                success: false,
                message: 'Invalid OTP code'
            });
        }

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
                profileImage: user.profileImage || '',
                createdAt: user.createdAt
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

        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been banned. Please contact support.'
            });
        }

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

        try {
            await sendOtpEmail(user.email, otpCode);
            console.log(`✅ New OTP sent successfully to ${email}`);
        } catch (emailError) {
            console.error('❌ Failed to send OTP:', emailError.message);
        }

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
    verifyOtp,
    resendOtp,
    refresh,
    logout
};