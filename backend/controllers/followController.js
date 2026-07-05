const User = require("../models/User");
const Follow = require("../models/Follow");

const followUser = async (req, res) => {
    try {

        if (req.user.id === req.params.id) {
            return res.status(400).json({
                message: "You cannot follow yourself."
            });
        }

        const exists = await Follow.findOne({
            follower: req.user.id,
            following: req.params.id
        });

        if (exists) {
            return res.status(400).json({
                message: "Already following this user."
            });
        }

        const follow = await Follow.create({
            follower: req.user.id,
            following: req.params.id
        });

        res.status(201).json(follow);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const unfollowUser = async (req, res) => {
    try {

        await Follow.findOneAndDelete({
            follower: req.user.id,
            following: req.params.id
        });

        res.json({
            message: "Unfollowed successfully."
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const getFollowers = async (req, res) => {
    try {

        const followers = await Follow.find({
            following: req.params.id
        }).populate("follower", "name email profileImage");

        res.json(followers);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const getFollowing = async (req, res) => {
    try {

        const following = await Follow.find({
            follower: req.params.id
        }).populate("following", "name email profileImage");

        res.json(following);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
const getUsers = async (req, res) => {
    try {

        const users = await User.find(
            {},
            "name email profileImage"
        );

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getUsers
};