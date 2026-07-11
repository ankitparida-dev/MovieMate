require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const upload =
  require('./middleware/upload');
const http = require('http');
const { Server } = require('socket.io');



const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173',
     "http://localhost:5174",
    'https://movie-mate-full-stack.vercel.app',
    'https://movie-mate-full-stack-96gack973-rangan-biswas-projects.vercel.app'
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


// Import Routes
const commentRoutes = require('./routes/commentRoutes');
const reviewRoutes =
require("./routes/reviewRoutes");
const authRoutes = require('./routes/authRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');
const adminRoutes = require('./routes/adminRoutes');
const movieListRoutes =
    require('./routes/movieListRoutes');

const followRoutes =
    require("./routes/followRoutes");

const reportRoutes =
    require("./routes/reportRoutes");


// Import SSR Controller
const { renderMoviesSSR } = require('./controllers/moviesSsrController');

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
  optionsSuccessStatus: 204
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

    // Broadcast when user joins
    io.emit("userActivity", {
        message: "A user joined"
    });

    // Custom notification event
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

// Routes

// SSR Route
app.get('/movies-ssr', renderMoviesSSR);

app.get('/login', (req, res) => {
    res.render('login', { error: req.query.error || '' });
});

app.get('/register', (req, res) => {
    res.render('register', { error: req.query.error || '' });
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { user: req.session.user || null });
});

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use(
    '/api/lists',
    movieListRoutes
);

app.use(
    "/api/follow",
    followRoutes
);
app.use(
    "/api/reviews",
    reviewRoutes
);
app.use('/api/comments', commentRoutes);
app.use('/api/reports', reportRoutes);

// Home Route
app.get('/', (req, res) => {
    res.json({
        message: 'MovieMate API is running!',
        endpoints: {
            ssr: '/movies-ssr',
            auth: '/api/auth',
            library: '/api/library',
            tmdb: '/api/tmdb'
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

// Start Server only if not testing
if (process.env.NODE_ENV !== "test") {

    server.listen(PORT, () => {

        console.log(`Server running on port ${PORT}`);
        console.log(`SSR Page: http://localhost:${PORT}/movies-ssr`);

    });

}

module.exports = app;