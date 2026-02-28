const express = require('express');
const router = express.Router();
const { fetchFromTMDB } = require('../controllers/tmdbController');

router.get('/*', fetchFromTMDB);

module.exports = router;