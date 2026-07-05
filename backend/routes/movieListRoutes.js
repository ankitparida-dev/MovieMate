const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const {
    getLists,
    getUserLists,
    createList,
    addMovieToList,
    removeMovieFromList,
    deleteList,
    likeList
} = require('../controllers/movieListController');

router.get('/', getLists);

router.get('/user', auth, getUserLists);

router.post('/', auth, createList);

router.post(
    '/:id/movies',
    auth,
    addMovieToList
);

router.delete(
    '/:id/movies/:movieId',
    auth,
    removeMovieFromList
);

router.delete(
    '/:id',
    auth,
    deleteList
);

router.patch(
    '/:id/like',
    auth,
    likeList
);

module.exports = router;
