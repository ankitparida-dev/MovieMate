const express = require('express');
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

//Middleware
app.use(express.json()); 
app.use(logger); 

//Serve Static Files
app.use('/static', express.static(path.join(__dirname, 'public')));


//Routing
app.use('/api/library', libraryRoutes);
app.use('/api/tmdb', tmdbRoutes);

app.use((req, res, next) => {
    const error = new Error(`Cannot ${req.method} ${req.url}`);
    error.status = 404;
    next(error); 
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});