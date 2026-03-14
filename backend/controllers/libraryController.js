const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/library.json');

const readData = () => {
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
};

const getLibrary = (req, res, next) => {
    try {
        const library = readData();
        res.status(200).json(library);
    } catch (error) {
        next(error); 
    }
};

const addToLibrary = (req, res, next) => {
    try {
        const { movieId, title, poster_path, media_type } = req.body;
        const library = readData();

        if (library.find(item => item.movieId === movieId)) {
            return res.status(400).json({ message: "Already in your library lmao" });
        }

        const newItem = { id: Date.now(), movieId, title, poster_path, media_type };
        library.push(newItem);

        fs.writeFileSync(dataPath, JSON.stringify(library, null, 2));
        res.status(201).json({ message: "Added successfully!", item: newItem });
    } catch (error) {
        next(error);
    }
};

const removeFromLibrary = (req, res, next) => {
    try {
        const idToRemove = parseInt(req.params.id); 
        let library = readData();

        library = library.filter(item => item.id !== idToRemove);
        
        fs.writeFileSync(dataPath, JSON.stringify(library, null, 2));
        res.status(200).json({ message: "Item yeeted from library." });
    } catch (error) {
        next(error);
    }
};

module.exports = { getLibrary, addToLibrary, removeFromLibrary };