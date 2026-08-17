// backend/server.js

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5000',
    'https://movie-mate-l894v3hnv-ankit-paridas-projects.vercel.app',
    'https://moviemate-l4ts.onrender.com'
];

if (process.env.ALLOWED_ORIGINS) {
    allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(',').map((url) => url.trim()));
}

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    if (origin.endsWith('.vercel.app')) return true;
    if (origin.endsWith('.onrender.com')) return true;
    return false;
};

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (isAllowedOrigin(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Origin not allowed by CORS'), false);
        },
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.set("io", io);

// Import Middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// ✅ Import Routes (No SSR/EJS routes, NO FOLLOW)
const commentRoutes = require('./routes/commentRoutes');
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require('./routes/authRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');
const adminRoutes = require('./routes/adminRoutes');
const movieListRoutes = require('./routes/movieListRoutes');
// ❌ REMOVED: const followRoutes = require("./routes/followRoutes");
const reportRoutes = require("./routes/reportRoutes");

// ❌ REMOVED: EJS view engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// Session Middleware
app.use(session({
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Middleware
app.use(express.json());
app.use(logger);
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400
}));

// Serve Static Files
app.use('/static', express.static(path.join(__dirname, 'public')));

// Socket.IO
let activeConnections = 0;

io.on("connection", (socket) => {
    activeConnections++;
    io.emit('onlineUsers', activeConnections);
    const timestamp = new Date().toLocaleTimeString();

    console.log(`User Connected`);
    console.log(`Socket ID: ${socket.id}`);
    console.log(`Time: ${timestamp}`);
    console.log(`Active Users: ${activeConnections}`);

    io.emit("userActivity", {
        message: "A user joined"
    });

    socket.on("notifyAll", (msg) => {
        io.emit("notification", msg);
    });

    socket.on("disconnect", () => {
        activeConnections--;
        io.emit('onlineUsers', activeConnections);
        const disconnectTime = new Date().toLocaleTimeString();
        
        console.log("\n========================================");
        console.log(`[SOCKET.IO] User Disconnected`);
        console.log(`Socket ID: ${socket.id}`);
        console.log(`Time: ${disconnectTime}`);
        console.log(`Active Users: ${activeConnections}`);
        console.log("========================================\n");
    });
});

// ============================================================
// ✅ API ROUTES
// ============================================================

// ✅ API Routes (NO FOLLOW)
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/lists', movieListRoutes);
// ❌ REMOVED: app.use("/api/follow", followRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reports', reportRoutes);

// ============================================================
// ✅ KEEP-ALIVE ENDPOINT
// ============================================================

app.get('/api/ping', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/api/wakeup', (req, res) => {
    res.json({
        status: 'woke',
        message: 'Server is awake!',
        timestamp: new Date().toISOString()
    });
});

// Home Route
app.get('/', (req, res) => {
    res.json({
        message: 'MovieMate API is running!',
        endpoints: {
            auth: '/api/auth',
            library: '/api/library',
            tmdb: '/api/tmdb',
            admin: '/api/admin',
            comments: '/api/comments',
            reports: '/api/reports',
            reviews: '/api/reviews',
            lists: '/api/lists'
        }
    });
});

// 404 Handler
app.use((req, res, next) => {
    const error = new Error(`Cannot ${req.method} ${req.url}`);
    error.status = 404;
    next(error);
});

// Error Handler
app.use(errorHandler);

// DB Connect
connectDB();

// Start Server
if (process.env.NODE_ENV !== "test") {
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📧 Mailgun: ${process.env.MAILGUN_DOMAIN || 'Not configured'}`);
    });
}

module.exports = app;