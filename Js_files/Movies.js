document.addEventListener('DOMContentLoaded', function() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_TOKEN}` 
    }
  };

  const grid = document.getElementById("movieGrid");
  const genreSelect = document.getElementById("genre");
  const yearSelect = document.getElementById("year");
  const sortSelect = document.getElementById("sort");
  const regionSelect = document.getElementById("region");
  const langSelect = document.getElementById("language");
  async function fetchAndRenderMovies() {
    const year = yearSelect.value;
    const genre = genreSelect.value;
    const sort = sortSelect.value;
    let url = `https://api.themoviedb.org/3/discover/movie?`;
    if (sort === "Newest First") {
      url += '&sort_by=release_date.desc';
    } else if (sort === "Oldest First") {
      url += '&sort_by=release_date.asc';
    } else if (sort === "Title(A-Z)") {
      url += '&sort_by=original_title.asc';
    } else if (sort === "Title(Z-A)") {
      url += '&sort_by=original_title.desc';
    } else {
      url += '&sort_by=popularity.desc';
    }

    if (year !== "Default") {
      url += `&primary_release_year=${year}`;
    }
    if (genre !== "All Genres") {
      url += `&with_genres=${genre}`; 
    }
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
        : 'Media files/placeholder-poster.png'; 

      const year = movie.release_date ? movie.release_date.split('-')[0] : "N/A";

      const movieLink = document.createElement('a');
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
  async function populateGenreDropdown() {
    const url = 'https://api.themoviedb.org/3/genre/movie/list';
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
  document.getElementById("applyBtn").onclick = () => {
    fetchAndRenderMovies(); 
    closeDrawer();
  };

  document.getElementById("resetBtn").onclick = () => {
    yearSelect.value = "Default";
    genreSelect.value = "All Genres";
    sortSelect.value = "Newest First";
    regionSelect.value = "Global";
    langSelect.value = "All Languages";
    fetchAndRenderMovies();
    closeDrawer();
  };
  populateGenreDropdown();
  fetchAndRenderMovies(); 

});