const MovieList = require('../models/MovieList');

const getLists = async (req, res) => {
    try {
        const lists = await MovieList.find()
            .sort({ createdAt: -1 });

        res.json(lists);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const createList = async (req, res) => {
    try {
        const list = await MovieList.create({
            userId: req.user.id,
            userName: req.user.name,
            title: req.body.title,
            description: req.body.description,
            isPublic: req.body.isPublic
        });

        res.status(201).json(list);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const addMovieToList = async (req, res) => {
    try {
        const list = await MovieList.findById(req.params.id);

        list.movies.push({
            mediaId: req.body.id,
            title: req.body.title,
            poster_path: req.body.poster_path,
            mediaType: req.body.media_type || 'movie',
            addedAt: new Date()
        });

        await list.save();

        res.json(list);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getLists,
    createList,
    addMovieToList
};