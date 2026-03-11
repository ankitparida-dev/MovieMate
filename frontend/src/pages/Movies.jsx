import { useEffect, useState } from "react";
import styles from "./Movies.module.css";
import MovieCard from "../components/MovieCard";
// 1. IMPORT getLanguages (assume it's in your api/tmdb.js)
import { discoverMovies, getGenres, getLanguages } from "../api/tmdb"; 

export default function Movies({ onOpen }) {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]); // <-- NEW STATE

  const [filters, setFilters] = useState({
    year: "Default",
    genre: "All Genres",
    sort: "Newest First",
    rating: "any", // <-- NEW FILTER
    language: "any", // <-- NEW FILTER
  });

  // 2. NEW FUNCTION to fetch languages
  async function fetchLanguages() {
    try {
      const data = await getLanguages();
      // Filter for languages that have an english_name
      const validLanguages = data.filter(lang => lang.english_name);
      setLanguages(validLanguages);
    } catch (err) {
      console.error("Failed to fetch languages:", err);
    }
  }

  // Fetch genres and languages once on load
  useEffect(() => {
    getGenres().then((d) => setGenres(d.genres));
    fetchLanguages(); // <-- CALL NEW FUNCTION
  }, []);

  // Refetch movies when filters change
  useEffect(() => {
    fetchMovies();
  }, [filters]);

  async function fetchMovies() {
    const params = {};
    // Sort
    if (filters.sort === "Newest First") params.sort_by = "release_date.desc";
    else if (filters.sort === "Oldest First") params.sort_by = "release_date.asc";
    else if (filters.sort === "Title(A-Z)") params.sort_by = "original_title.asc";
    else if (filters.sort === "Title(Z-A)") params.sort_by = "original_title.desc";
    
    // Year
    if (filters.year !== "Default") params.primary_release_year = filters.year;
    
    // Genre
    if (filters.genre !== "All Genres") params.with_genres = filters.genre;

    // 3. ADD NEW FILTERS TO PARAMS
    // Rating
    if (filters.rating !== "any") params["vote_average.gte"] = Number(filters.rating);
    
    // Language
    if (filters.language !== "any") params.with_original_language = filters.language;

    discoverMovies(params).then((data) => setMovies(data.results));
  }

  function updateFilter(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function resetFilters() {
    setFilters({
      year: "Default",
      genre: "All Genres",
      sort: "Newest First",
      rating: "any", // <-- RESET
      language: "any", // <-- RESET
    });
  }

  // --- This is the new return block ---
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles["movies-title"]}>Movies</h1>
      </div>

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

        {/* 4. NEW RATING DROPDOWN */}
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
        
        {/* 5. NEW LANGUAGE DROPDOWN */}
        <select
          className={styles["filter-select"]}
          value={filters.language}
          onChange={(e) => updateFilter("language", e.target.value)}
        >
          <option value="any">All Languages</option>
          {/* Sort languages alphabetically */}
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

      <div className={styles.grid}>
        {movies.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
            onClick={() => onOpen({ ...m, media_type: "movie" })}
          />
        ))}
      </div>
    </div>
  );
}