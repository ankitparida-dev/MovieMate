// This all goes in /Js files/TvShows.js

// This waits for the HTML to be ready before running
document.addEventListener('DOMContentLoaded', function() {

  // --- 1. API SETUP & GLOBAL VARIABLES ---
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_TOKEN}` // From config.js
    }
  };

  // CHANGED: Make sure your TvShows.html has a grid with id="tvShowGrid"
  const grid = document.getElementById("tvShowGrid"); 
  const genreSelect = document.getElementById("genre");
  const yearSelect = document.getElementById("year");
  const sortSelect = document.getElementById("sort");
  const regionSelect = document.getElementById("region");
  const langSelect = document.getElementById("language");

  // --- 2. THE MAIN FETCH FUNCTION ---

  // CHANGED: Renamed to fetchAndRenderShows
  async function fetchAndRenderShows() {
    // 1. Read all the filter values
    const year = yearSelect.value;
    const genre = genreSelect.value;
    const sort = sortSelect.value;

    // 2. Build the API URL
    // CHANGED: Endpoint is now /discover/tv
    let url = `https://api.themoviedb.org/3/discover/tv?`;

    // 3. Translate our sort value into an API parameter
    // CHANGED: Use TV-specific sort keys
    if (sort === "Newest First") {
      url += '&sort_by=first_air_date.desc';
    } else if (sort === "Oldest First") {
      url += '&sort_by=first_air_date.asc';
    } else if (sort === "Title(A-Z)") {
      // CHANGED: original_title -> original_name
      url += '&sort_by=original_name.asc';
    } else if (sort === "Title(Z-A)") {
      // CHANGED: original_title -> original_name
      url += '&sort_by=original_name.desc';
    } else {
      url += '&sort_by=popularity.desc';
    }

    // 4. Add year if one is selected
    if (year !== "Default") {
      // CHANGED: primary_release_year -> first_air_date_year
      url += `&first_air_date_year=${year}`;
    }
    
    // 5. Add genre if one is selected
    if (genre !== "All Genres") {
      url += `&with_genres=${genre}`;
    }

    // 6. Fetch the shows
    try {
      const response = await fetch(url, options);      
      const data = await response.json();
      
      // CHANGED: Call renderShows
      renderShows(data.results);
      
    } catch (error) {
      console.error("Error fetching TV shows:", error); // CHANGED
    }
  }

  // --- 3. THE RENDER FUNCTION ---

  // CHANGED: Renamed to renderShows
  function renderShows(list) {
    grid.innerHTML = "";
    
    if (list.length === 0) {
      // CHANGED: "movies" -> "TV shows"
      grid.innerHTML = '<p class="no-results">No TV shows found matching your criteria.</p>';
      return;
    }

    // CHANGED: "movie" -> "show"
    list.forEach((show) => {
      const poster = show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : 'Media files/placeholder-poster.png'; 

      // CHANGED: release_date -> first_air_date
      const year = show.first_air_date ? show.first_air_date.split('-')[0] : "N/A";

      // CHANGED: "movieLink" -> "showLink"
      const showLink = document.createElement('a');
      
      // CHANGED: Link to a new tv-about.html page
      showLink.href = `../Html files/tv-about.html?id=${show.id}`; 
      
      showLink.innerHTML = `
        <div class="card">
          <div class="poster" style="background-image:url('${poster}')">
          </div>
          <div class="card-content">
            <div class="movie-title">${show.name}</div>
            <div class="meta">${year}</div>
          </div>
        </div>`;
        
      grid.appendChild(showLink);
    });
  }

  // --- 4. POPULATE THE GENRE DROPDOWN ---

  async function populateGenreDropdown() {
    // CHANGED: Endpoint is now /genre/tv/list
    const url = 'https://api.themoviedb.org/3/genre/tv/list';
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      
      data.genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.innerText = genre.name;
        genreSelect.appendChild(option);
      });

    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }

  // --- 5. ALL EVENT LISTENERS ---

  // Drawer open/close logic (this is your original code, no changes)
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
    // CHANGED: Call fetchAndRenderShows
    fetchAndRenderShows(); 
    closeDrawer();
  };

  // Reset button
  document.getElementById("resetBtn").onclick = () => {
    yearSelect.value = "Default";
    genreSelect.value = "All Genres";
    sortSelect.value = "Newest First";
    regionSelect.value = "Global";
    langSelect.value = "All Languages";
    
    // CHANGED: Call fetchAndRenderShows
    fetchAndRenderShows();
    closeDrawer();
  };


  // --- 6. INITIAL PAGE LOAD ---
  
  populateGenreDropdown(); // Fill the genres
  fetchAndRenderShows(); // Fetch the default popular shows

});