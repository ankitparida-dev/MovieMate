const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const {
    getStats,
    getUsers,
    getReviews,
    getComments,
    deleteReview,
    deleteComment
} = require('../controllers/adminController');

router.use(auth, admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/reviews', getReviews);
router.get('/comments', getComments);

router.delete('/reviews/:id', deleteReview);
router.delete('/comments/:id', deleteComment);

module.exports = router;