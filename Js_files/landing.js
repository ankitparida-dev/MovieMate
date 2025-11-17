
document.addEventListener('DOMContentLoaded', function() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_TOKEN}` 
      }
    };
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');
    const contentGrid = document.querySelector('.content-grid');
    const contentTitle = document.querySelector('.content-title');


    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            triggerSearch();
        }
    });

    searchIcon.addEventListener('click', () => {
        triggerSearch();
    });
  
    function triggerSearch() {
        const query = searchInput.value.trim(); 
        if (query) {
            performSearch(query);
        } else {
            contentTitle.innerText = 'Trending Movies and Shows';
            fetchTrendingMovies(); 
        }
    }

    fetchTrendingMovies();
    fetchUpcomingMovies();
    async function fetchTrendingMovies() {
     const url = 'https://api.themoviedb.org/3/trending/all/week';
      const grid = document.querySelector('.content-grid');
      if (grid) {
        grid.innerHTML = ''; 
      } else {
        console.error('Error: .content-grid not found!');
        return; 
      }

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Trending fetch failed');
        
        const data = await response.json();

        data.results.forEach(item => {
          const movieCard = createMovieCard(item);
          grid.appendChild(movieCard);
        });
        
        populateSpotlight(data.results[0]);

      } catch (error) {
        console.error('Error fetching trending movies:', error);
      }
    }
    async function fetchUpcomingMovies() {
      const url = 'https://api.themoviedb.org/3/movie/upcoming';
      const grid = document.querySelector('.upcoming-grid');

      if (grid) {
        grid.innerHTML = ''; 
      } else {
        console.error('Error: .upcoming-grid not found!');
        return;
      }
      
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Upcoming fetch failed');

        const data = await response.json();
        
        const upcomingToShow = data.results.slice(0, 4);

        upcomingToShow.forEach(movie => {
          const movieCard = createUpcomingCard(movie);
          grid.appendChild(movieCard);
        });
      } catch (error) {
        console.error('Error fetching upcoming movies:', error);
      }
    }


    async function performSearch(query) {
        const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}`;
        
        if (!contentGrid) return; 
        
        contentGrid.innerHTML = ''; 
        contentTitle.innerText = `Search Results for "${query}"`; 

        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error('Search fetch failed');

            const data = await response.json();
            
            if (data.results.length === 0) {
                contentGrid.innerHTML = '<p class="no-results">No movies found for that search.</p>';
                return;
            }
            
            data.results.forEach(movie => {
                const movieCard = createMovieCard(movie);
                contentGrid.appendChild(movieCard);
            });

        } catch (error) {
            console.error('Error fetching search results:', error);
            contentGrid.innerHTML = '<p class.no-results">Sorry, something went wrong.</p>';
        }
    }
      function createMovieCard(item) { 
      const card = document.createElement('div');
      card.classList.add('content-card', 'interactive-feature');

      const isMovie = item.media_type === 'movie' || (item.title && !item.name);
      const mediaType = item.media_type ? item.media_type : (isMovie ? 'movie' : 'tv');
      if (mediaType === 'person') {
          return null;
      }
      const title = item.title || item.name; 
      const releaseDate = item.release_date || item.first_air_date; 

      const poster = item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : 'Media files/placeholder-poster.png'; 
      
      card.innerHTML = `
        <a href="Html_files/about.html?id=${item.id}&type=${mediaType}" class="card-link">
          <img src="${poster}" alt="${title}" class="card-image">
          <div class="card-content">
            <h3 class="card-title">${title}</h3>
            <div class="card-meta">
              <span>${releaseDate ? releaseDate.split('-')[0] : 'TBA'}</span>
              <div class="card-rating">
                <i class="fas fa-star"></i>
                <span>${item.vote_average.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </a>
      `;
      return card;
    }
    
    function createUpcomingCard(movie) {
      const card = document.createElement('div');
      card.classList.add('upcoming-card', 'interactive-feature');
      
      const poster = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'Media files/placeholder-poster.png';
        
      card.innerHTML = `
        <img src="${poster}" alt="${movie.title}" class="upcoming-image">
        <div class="upcoming-content">
          <h3 class="upcoming-title">${movie.title}</h3>
          <div class="upcoming-meta">
            <span class="upcoming-date">${movie.release_date}</span>
            <div class="upcoming-rating">
              <i class="fas fa-star"></i>
              <span>Coming Soon</span>
            </div>
          </div>
          <p class="upcoming-description">${movie.overview.substring(0, 150)}...</p>
          <div class="upcoming-actions">
            <button class="upcoming-btn remind-btn">
              <i class="fas fa-bell"></i> Remind Me
            </button>
            <a href="/Html_Files/about.html?id=${movie.id}" class="upcoming-btn info-btn-upcoming">
              <i class="fas fa-info-circle"></i> Info
            </a>
          </div>
        </div>
      `;
      return card;
    }
  
  });