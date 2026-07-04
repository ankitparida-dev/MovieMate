const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const {
    getLists,
    createList,
    addMovieToList
} = require('../controllers/movieListController');

router.get('/', getLists);
router.post('/', auth, createList);

router.post(
    '/:id/movies',
    auth,
    addMovieToList
);
router.delete('/:id/movies/:movieId', auth, removeMovieFromList);
router.delete('/:id', auth, deleteList);
router.patch('/:id/like', auth, likeList);

module.exports = router;