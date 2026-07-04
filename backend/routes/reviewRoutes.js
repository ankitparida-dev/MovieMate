const express = require("express");

const router = express.Router();

const auth =
    require("../middleware/auth");

const {
    getMovieReviews,
    createReview,
    deleteReview,
    likeReview,
    markHelpful
} = require(
    "../controllers/reviewController"
);

router.get(
    "/movie/:mediaId",
    getMovieReviews
);

router.post(
    "/",
    auth,
    createReview
);

router.delete(
    "/:id",
    auth,
    deleteReview
);

router.post(
    "/:id/like",
    auth,
    likeReview
);

router.post(
    "/:id/helpful",
    auth,
    markHelpful
);

module.exports = router;