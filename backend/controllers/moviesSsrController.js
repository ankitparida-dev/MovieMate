const renderMoviesSSR = async (req, res) => {
    try {
        // Create / Use Session
        req.session.pageViews =
            (req.session.pageViews || 0) + 1;

        const port = process.env.PORT || 5000;
        const response = await fetch(
            `http://localhost:${port}/api/tmdb/movie/popular`
        );

        const data = await response.json();

        res.render("movies-ssr", {
            movies: data.results || [],
            title: "Popular Movies",
            views: req.session.pageViews
        });

    } catch (error) {
        req.session.pageViews =
            (req.session.pageViews || 0) + 1;

        res.render("movies-ssr", {
            movies: [],
            title: "Error",
            views: req.session.pageViews
        });
    }
};

module.exports = {
    renderMoviesSSR
};