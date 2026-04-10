const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session'); // ✅ ADD THIS

// Import Middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import Routes
const libraryRoutes = require('./routes/libraryRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');

// Import SSR Controller
const { renderMoviesSSR } = require('./controllers/moviesSsrController');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Session Middleware (ADD THIS - required for req.session)
app.use(session({
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,  // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Middleware
app.use(express.json()); 
app.use(logger); 

// Serve Static Files
app.use('/static', express.static(path.join(__dirname, 'public')));

// ========== ROUTES ==========

// ✅ SSR Route
app.get('/movies-ssr', renderMoviesSSR);

// API Routes
app.use('/api/library', libraryRoutes);
app.use('/api/tmdb', tmdbRoutes);

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'MovieMate API is running!',
        endpoints: {
            ssr: '/movies-ssr',
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`📺 SSR Page available at: http://localhost:${PORT}/movies-ssr`);
});