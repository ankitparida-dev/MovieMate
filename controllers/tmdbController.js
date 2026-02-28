const BASE_URL = "https://api.themoviedb.org/3";

const fetchFromTMDB = async (req, res, next) => {
    try {
        const tmdbPath = req.params[0]; 
        const queryString = new URLSearchParams(req.query).toString();
        const fullUrl = `${BASE_URL}/${tmdbPath}?${queryString}`;

        const response = await fetch(fullUrl, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
            },
        });

        if (!response.ok) throw new Error(`TMDB Error: ${response.status}`);

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        next(error); 
    }
};

module.exports = { fetchFromTMDB };