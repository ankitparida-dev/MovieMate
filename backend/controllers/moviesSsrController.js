// No API key required - Using mock data for demonstration

const renderMoviesSSR = async (req, res) => {
    console.log('🎬 Rendering SSR movies page with mock data...');
    
    // Mock movie data for SSR demonstration
    const mockMovies = [
        {
            id: 1,
            title: "Inception",
            poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uyi.jpg",
            vote_average: 8.8,
            release_date: "2010-07-16",
            overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
        },
        {
            id: 2,
            title: "Interstellar",
            poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            vote_average: 8.6,
            release_date: "2014-11-07",
            overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
        },
        {
            id: 3,
            title: "The Dark Knight",
            poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            vote_average: 9.0,
            release_date: "2008-07-18",
            overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
        },
        {
            id: 4,
            title: "The Matrix",
            poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            vote_average: 8.7,
            release_date: "1999-03-31",
            overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers."
        },
        {
            id: 5,
            title: "John Wick",
            poster_path: "/fZPSd2y4qGUc7jrzQhziVYGT7sS.jpg",
            vote_average: 7.4,
            release_date: "2014-10-22",
            overview: "An ex-hitman comes out of retirement to track down the gangsters who killed his dog and stole his car."
        },
        {
            id: 6,
            title: "Avengers: Endgame",
            poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
            vote_average: 8.4,
            release_date: "2019-04-26",
            overview: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe."
        },
        {
            id: 7,
            title: "Joker",
            poster_path: "/udDclJoHjfjb8EkxOU4RnFfWBSj.jpg",
            vote_average: 8.5,
            release_date: "2019-10-04",
            overview: "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure."
        },
        {
            id: 8,
            title: "Parasite",
            poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
            vote_average: 8.6,
            release_date: "2019-05-30",
            overview: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan."
        }
    ];

    // Render EJS template with mock movie data
    res.render('movies-ssr', {
        movies: mockMovies,
        title: 'MovieMate - Popular Movies (SSR Demo)',
        error: null,
        totalMovies: mockMovies.length,
        isMockData: true  // Optional: to show a badge that it's demo data
    });
};

module.exports = { renderMoviesSSR };