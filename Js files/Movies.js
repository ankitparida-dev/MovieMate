// This all goes in /Js files/Movies.js

// This waits for the HTML to be ready before running
document.addEventListener('DOMContentLoaded', function() {

  // --- 1. API SETUP & GLOBAL VARIABLES ---
  
  // This is your API options, just like before
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_TOKEN}` // From config.js
    }
  };

  const grid = document.getElementById("movieGrid");
  const genreSelect = document.getElementById("genre");
  const yearSelect = document.getElementById("year");
  const sortSelect = document.getElementById("sort");
  const regionSelect = document.getElementById("region");
  const langSelect = document.getElementById("language");

  // --- 2. THE MAIN FETCH FUNCTION ---

  /**
   * Fetches movies from TMDB based on the current filter settings
   * and tells renderMovies() to display them.
   */
  async function fetchAndRenderMovies() {
    // 1. Read all the filter values
    const year = yearSelect.value;
    const genre = genreSelect.value;
    const sort = sortSelect.value;

    // 2. Build the API URL
    let url = `https://api.themoviedb.org/3/discover/movie?`;

    // 3. Translate our sort value into an API parameter
    if (sort === "Newest First") {
      url += '&sort_by=release_date.desc';
    } else if (sort === "Oldest First") {
      url += '&sort_by=release_date.asc';
    } else if (sort === "Title(A-Z)") {
      url += '&sort_by=original_title.asc';
    } else if (sort === "Title(Z-A)") {
      url += '&sort_by=original_title.desc';
    } else {
      // Default sort (like "Popularity")
      url += '&sort_by=popularity.desc';
    }

    // 4. Add year if one is selected
    if (year !== "Default") {
      url += `&primary_release_year=${year}`;
    }
    
    // 5. Add genre if one is selected
    if (genre !== "All Genres") {
      url += `&with_genres=${genre}`; // 'genre' is now an ID!
    }

    // 6. Fetch the movies
    try {
      const response = await fetch(url, options);      
      const data = await response.json();
      renderMovies(data.results);
      
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }
  function renderMovies(list) {
    grid.innerHTML = "";
    
    if (list.length === 0) {
      grid.innerHTML = '<p class="no-results">No movies found matching your criteria.</p>';
      return;
    }

    list.forEach((movie) => {
      const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'Media files/placeholder-poster.png'; // Make a placeholder!

      const year = movie.release_date ? movie.release_date.split('-')[0] : "N/A";

      const movieLink = document.createElement('a');
      // Assumes Movies.html is in 'Html files' folder, so we go up one level
      movieLink.href = `../Html files/about.html?id=${movie.id}`; 
      
      movieLink.innerHTML = `
        <div class="card">
          <div class="poster" style="background-image:url('${poster}')">
          </div>
          <div class="card-content">
            <div class="movie-title">${movie.title}</div>
            <div class="meta">${year}</div>
          </div>
        </div>`;
        
      grid.appendChild(movieLink);
    });
  }

  // --- 4. POPULATE THE GENRE DROPDOWN ---

  /**
   * Fetches all official movie genres from TMDB
   * and builds the <option> elements for the select dropdown.
   */
  async function populateGenreDropdown() {
    const url = 'https://api.themoviedb.org/3/genre/movie/list';
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      
      // data.genres is an array of {id: 28, name: "Action"}
      data.genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id; // The value will be the ID
        option.innerText = genre.name; // The text will be the Name
        genreSelect.appendChild(option);
      });

    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }

  // --- 5. ALL EVENT LISTENERS ---

  // Drawer open/close logic (this is your original code)
  const drawer = document.getElementById("drawer");
  const backdrop = document.getElementById("drawerBackdrop");
  
  document.getElementById("openFilter").onclick = () => {
    drawer.classList.add("open");
    backdrop.style.display = "block";
  };

  document.getElementById("closeFilter").onclick = closeDrawer;
  backdrop.onclick = closeDrawer;
  
  function closeDrawer() {
    drawer.classList.remove("open");
    backdrop.style.display = "none";
  }

  // Apply button
  document.getElementById("applyBtn").onclick = () => {
    // All we do is re-run the fetch with the new values
    fetchAndRenderMovies(); 
    closeDrawer();
  };

  // Reset button
  document.getElementById("resetBtn").onclick = () => {
    // Reset all the dropdowns to their default value
    yearSelect.value = "Default";
    genreSelect.value = "All Genres";
    sortSelect.value = "Newest First";
    regionSelect.value = "Global";
    langSelect.value = "All Languages";
    
    // Fetch the default results again
    fetchAndRenderMovies();
    closeDrawer();
  };


  // --- 6. INITIAL PAGE LOAD ---
  
  // Call our functions to fill the page when it first loads
  populateGenreDropdown(); // Fill the genres
  fetchAndRenderMovies(); // Fetch the default popular movies

});