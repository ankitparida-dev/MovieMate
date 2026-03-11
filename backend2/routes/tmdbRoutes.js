const express = require('express');
const router = express.Router();
const { fetchFromTMDB } = require('../controllers/tmdbController');

router.use( fetchFromTMDB);

module.exports = router;