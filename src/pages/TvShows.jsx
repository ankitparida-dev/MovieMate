import { useEffect, useState } from "react";
// 1. We can re-use the same CSS module file!
import styles from "./Movies.module.css"; 
import MovieCard from "../components/MovieCard"; // We can re-use MovieCard
import { 
  discoverTv, // <-- CHANGED
  getTvGenres, // <-- CHANGED
  getLanguages 
} from "../api/tmdb";

export default function TVShows({ onOpen }) {
  // 2. Renamed 'movies' to 'shows' for clarity
  const [shows, setShows] = useState([]); 
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [filters, setFilters] = useState({
    year: "Default",
    genre: "All Genres",
    sort: "Newest First",
    rating: "any",
    language: "any",
  });

  async function fetchLanguages() {
    try {
      const data = await getLanguages();
      const validLanguages = data.filter(lang => lang.english_name);
      setLanguages(validLanguages);
    } catch (err) {
      console.error("Failed to fetch languages:", err);
    }
  }

  // Fetch genres and languages once on load
  useEffect(() => {
    // 3. Call getTvGenres instead of getGenres
    getTvGenres().then((d) => setGenres(d.genres)); 
    fetchLanguages();
  }, []);

  // Refetch shows when filters change
  useEffect(() => {
    fetchShows();
  }, [filters]);

  // 4. This is the main updated function
  async function fetchShows() {
    const params = {};
    
    // Sort
    if (filters.sort === "Newest First") params.sort_by = "first_air_date.desc"; // <-- TV PARAM
    else if (filters.sort === "Oldest First") params.sort_by = "first_air_date.asc"; // <-- TV PARAM
    else if (filters.sort === "Title(A-Z)") params.sort_by = "original_name.asc"; // (name, not title)
    else if (filters.sort === "Title(Z-A)") params.sort_by = "original_name.desc";
    
    // Year
    if (filters.year !== "Default") params.first_air_date_year = filters.year; // <-- TV PARAM
    
    // Genre
    if (filters.genre !== "All Genres") params.with_genres = filters.genre;

    // Rating
    if (filters.rating !== "any") params["vote_average.gte"] = Number(filters.rating);
    
    // Language
    if (filters.language !== "any") params.with_original_language = filters.language;

    // Call discoverTv and setShows
    discoverTv(params).then((data) => setShows(data.results));
  }

  function updateFilter(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function resetFilters() {
    setFilters({
      year: "Default",
      genre: "All Genres",
      sort: "Newest First",
      rating: "any",
      language: "any",
    });
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles["movies-title"]}>TV Shows</h1>
      </div>

      {/* Filter bar is identical JSX */}
      <div className={styles["filter-bar"]}>
        {/* Year Select */}
        <select
          className={styles["filter-select"]}
          value={filters.year}
          onChange={(e) => updateFilter("year", e.target.value)}
        >
          <option value="Default">Any Year</option>
          {Array.from({ length: 20 }, (_, i) => 2025 - i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Genre Select */}
        <select
          className={styles["filter-select"]}
          value={filters.genre}
          onChange={(e) => updateFilter("genre", e.target.value)}
        >
          <option value="All Genres">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Sort Select */}
        <select
          className={styles["filter-select"]}
          value={filters.sort}
          onChange={(e) => updateFilter("sort", e.target.value)}
        >
          <option>Newest First</option>
          <option>Oldest First</option>
          <option>Title(A-Z)</option>
          <option>Title(Z-A)</option>
        </select>
        
        {/* Rating Dropdown */}
        <select
          className={styles["filter-select"]}
          value={filters.rating}
          onChange={(e) => updateFilter("rating", e.target.value)}
        >
          <option value="any">Any Rating</option>
          <option value="9">9+ Rating</option>
          <option value="8">8+ Rating</option>
          <option value="7">7+ Rating</option>
          <option value="6">6+ Rating</option>
          <option value="5">5+ Rating</option>
        </select>
        
        {/* Language Dropdown */}
        <select
          className={styles["filter-select"]}
          value={filters.language}
          onChange={(e) => updateFilter("language", e.target.value)}
        >
          <option value="any">All Languages</option>
          {languages
            .sort((a, b) => a.english_name.localeCompare(b.english_name))
            .map((lang) => (
              <option key={lang.iso_639_1} value={lang.iso_639_1}>
                {lang.english_name}
              </option>
            ))}
        </select>

        {/* Reset Button */}
        <button className={styles["filter-button"]} onClick={resetFilters}>
          Reset
        </button>
      </div>

      {/* 5. Map over 'shows' and pass 'show' to MovieCard */}
      <div className={styles.grid}>
        {shows.map((show) => (
          <MovieCard
            key={show.id}
            movie={show} // MovieCard just needs an object with poster_path, title, etc.
            onClick={() => onOpen({ ...show, media_type: "tv" })}
          />
        ))}
      </div>
    </div>
  );
}