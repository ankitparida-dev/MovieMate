
document.addEventListener('DOMContentLoaded', function() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_TOKEN}` 
      }
    };


    fetchTrendingMovies();
    fetchUpcomingMovies();
    async function fetchTrendingMovies() {
      const url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc';
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

        data.results.forEach(movie => {
          const movieCard = createMovieCard(movie);
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

    function createMovieCard(movie) {
      const card = document.createElement('div');
      card.classList.add('content-card', 'interactive-feature');

      const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'Media files/placeholder-poster.png'; 
      
      card.innerHTML = `
        <a href="Html files/about.html?id=${movie.id}" class="card-link">
          <img src="${poster}" alt="${movie.title}" class="card-image">
          <div class="card-content">
            <h3 class="card-title">${movie.title}</h3>
            <div class="card-meta">
              <span>${movie.release_date.split('-')[0]}</span>
              <div class="card-rating">
                <i class="fas fa-star"></i>
                <span>${movie.vote_average.toFixed(1)}</span>
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
      
      const poster = movie.backdrop_path // Use backdrop for these cards
        ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
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
            <a href="Html files/about.html?id=${movie.id}" class="upcoming-btn info-btn-upcoming">
              <i class="fas fa-info-circle"></i> Info
            </a>
          </div>
        </div>
      `;
      return card;
    }

    function populateSpotlight(movie) {
      const spotlightSection = document.querySelector('.carousel-image');
      if (!spotlightSection) return;

      const title = spotlightSection.querySelector('.show-name');
      const overview = spotlightSection.querySelector('.overview');
      const detailsLink = spotlightSection.querySelector('.detail-link');
      const releaseDate = spotlightSection.querySelector('.details p:nth-child(3)');
      const runtime = spotlightSection.querySelector('.details p:nth-child(2)');

      spotlightSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
      
      title.innerText = movie.title;
      overview.innerText = movie.overview;
      releaseDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${movie.release_date.split('-')[0]}`;
      
      if (runtime) runtime.style.display = 'none'; 
      detailsLink.href = `Html files/about.html?id=${movie.id}`;
    }

});