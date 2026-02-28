const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import Middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import Routes
const libraryRoutes = require('./routes/libraryRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 1. App-level Middleware
app.use(cors());
app.use(express.json()); 
app.use(logger); 

// 2. Serve Static Files (Lecture 21-24)
app.use('/static', express.static(path.join(__dirname, 'public')));

// 3. Routing
app.use('/api/library', libraryRoutes);
app.use('/api/tmdb', tmdbRoutes);

// 4. Exception Handling Middleware (Must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`MovieMate backend blasting off on port ${PORT} 🚀`);
});