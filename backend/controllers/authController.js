const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios');
const User = require('../models/User');

const mailgunConfig = {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    baseUrl: process.env.MAILGUN_BASE_URL || 'https://api.mailgun.net/v3'
};

const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};

const createTransporter = () => {
    if (!smtpConfig.host || !smtpConfig.auth.user || !smtpConfig.auth.pass) {
        return null;
    }

    return nodemailer.createTransport(smtpConfig);
};

const sendOtpEmail = async (email, otp) => {
    const from = process.env.EMAIL_FROM || 'MovieMate <no-reply@moviemate.com>';
    const subject = 'Your MovieMate verification code';
    const text = `Your MovieMate verification code is ${otp}. It expires in 10 minutes.`;
    const html = `<p>Your MovieMate verification code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`;

    if (mailgunConfig.apiKey && mailgunConfig.domain) {
        const url = `${mailgunConfig.baseUrl}/${mailgunConfig.domain}/messages`;
        const form = new URLSearchParams();
        form.append('from', from);
        form.append('to', email);
        form.append('subject', subject);
        form.append('text', text);
        form.append('html', html);

        await axios.post(url, form.toString(), {
            auth: {
                username: 'api',
                password: mailgunConfig.apiKey
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return;
    }

    const transporter = createTransporter();

    if (!transporter) {
        console.warn('SMTP is not configured. OTP email will not be sent.');
        return;
    }

    await transporter.sendMail({
        from,
        to: email,
        subject,
        text,
        html
    });
};

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate Access + Refresh Tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        {
            id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            isBanned: user.isBanned
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

// Register User
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

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    const io = req.app.get("io");
    io.emit("userActivity", {
      message: "New user registered 🚀"
    });

    res.status(201).json({
      success: true,
      message: 'Registered successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

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

        const otpCode = generateOtp();
        user.otpCode = otpCode;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        try {
            await sendOtpEmail(user.email, otpCode);
        } catch (emailError) {
            console.error('OTP EMAIL ERROR:', emailError);
        }

        res.status(200).json({
            success: true,
            otpRequired: true,
            message: 'OTP sent to your email'
        });

    } catch (error) {
        console.error(
        "LOGIN CONTROLLER ERROR:",
        error
    );
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

// Verify One-Time Password
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

        if (!user.otpExpires || user.otpExpires < new Date()) {
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

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('userActivity', {
                message: 'User verified OTP and logged in'
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
                isAdmin: user.isAdmin,
                isBanned: user.isBanned
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

        const otpCode = generateOtp();
        user.otpCode = otpCode;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        try {
            await sendOtpEmail(user.email, otpCode);
        } catch (emailError) {
            console.error('OTP EMAIL ERROR:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'A new OTP code was sent to your email'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to resend OTP',
            error: error.message
        });
    }
};

// Refresh Access Token
const refresh = async (req, res) => {
    try {
        const refreshToken = req.body?.refreshToken;

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

        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

       const newAccessToken = jwt.sign(
    {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isBanned: user.isBanned
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
);

        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        res.status(403).json({
            success: false,
            message: 'Invalid or expired refresh token'
        });
    }
};

// Logout User
const logout = async (req, res) => {
    try {
        const refreshToken = req.body?.refreshToken;

        if (refreshToken) {
            await User.findOneAndUpdate(
                { refreshToken },
                { refreshToken: null }
            );
        }

        res.clearCookie("token");

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    verifyOtp,
    resendOtp,
    refresh,
    logout
};