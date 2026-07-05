const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getUsers
} = require("../controllers/followController");

router.post(
    "/:id",
    auth,
    followUser
);

router.delete(
    "/:id",
    auth,
    unfollowUser
);

router.get(
    "/users",
    auth,
    getUsers
);

router.get(
    "/followers/:id",
    getFollowers
);

router.get(
    "/following/:id",
    getFollowing
);

module.exports = router;