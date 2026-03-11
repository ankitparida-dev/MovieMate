const express = require('express');
const router = express.Router();
const { getLibrary, addToLibrary, removeFromLibrary } = require('../controllers/libraryController');

router.get('/', getLibrary);
router.post('/add', addToLibrary);
router.delete('/remove/:id', removeFromLibrary); 

module.exports = router;