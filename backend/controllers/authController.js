const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

        const { accessToken, refreshToken } = generateTokens(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        });

        const io = req.app.get("io");

        io.emit("userActivity", {
            message: "User logged in"
        });

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
    refresh,
    logout
};