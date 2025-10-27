const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const URL = `https://api.themoviedb.org/3/movie/${movieId}`;
const creditsURL = `https://api.themoviedb.org/3/movie/${movieId}/credits`;
const recsURL = `https://api.themoviedb.org/3/movie/${movieId}/recommendations`;

let poster = document.querySelector(".show-poster img");
let title = document.querySelector('.show-title');
let overview = document.querySelector('.overview p');
let runtime = document.querySelector('.show-boxes .box-item:nth-child(2)');
let originalTitle = document.querySelector('.details .detail-items:nth-child(1) p');
let firstAirDate = document.querySelector(".details .detail-items:nth-child(2) p");
let lastAirDate = document.querySelector(".details .detail-items:nth-child(3) p");
let duration = document.querySelector(".details .detail-items:nth-child(4) p");
let status1 = document.querySelector(".details .detail-items:nth-child(5) p");
let rating = document.querySelector(".details .detail-items:nth-child(6) p");
let genres = document.querySelector('.details .detail-items:nth-child(7) p');
let companies = document.querySelector('.details .detail-items:nth-child(8) p');

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_TOKEN}`
  }
};
async function getMoviedetails(){
    const response = await fetch(URL, options);
    const data = await response.json();
    console.log(data);
    populateMovieFields(data);

    const responseCredits = await fetch(creditsURL, options);
    const dataCredits = await responseCredits.json();
    console.log(dataCredits);
    populateCast(dataCredits.cast);
    populateStaff(dataCredits.crew);

    const responseRec = await fetch(recsURL, options);
    const dataRec = await responseRec.json();
    console.log(dataRec);
    populateRecommendations(dataRec.results);
}
function populateMovieFields(data){
    poster.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    poster.alt = data.title;
    title.innerText = data.title;
    overview.innerText = data.overview;
    runtime.innerText = `${data.runtime}m`;
    originalTitle.innerText = data.original_title;
    firstAirDate.innerText = data.release_date;
    if (lastAirDate) {
    lastAirDate.style.display = 'none';
  }
    duration.innerText = `${data.runtime}m`;
    status1.innerText = data.status;
    rating.innerText = data.vote_average.toFixed(1);
    genres.innerText = data.genres.map(genre => genre.name).join(', ');
    companies.innerText = data.production_companies.map(company => company.name).join(', ');
}
function populateCast(castArray) {
  const castContainer = document.querySelector('.cast');
  castContainer.innerHTML = ''; 
  const castToShow = castArray.slice(0, 6); 
  castToShow.forEach(person => {
    const castCard = document.createElement('div');
    castCard.classList.add('cast-item');
    castCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w185${person.profile_path}" alt="${person.name}">
      <h3>${person.name}</h3>
      <p>${person.character}</p>
    `;
    castContainer.appendChild(castCard);
  });
}
function populateStaff(crewArray) {
  const staffContainer = document.querySelector('.staff');
  staffContainer.innerHTML = ''; 
  const director = crewArray.find(person => person.job === 'Director');
  if (director) {      
    const staffCard = document.createElement('div');
    staffCard.classList.add('staff-item'); 
    staffCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w185${director.profile_path}" alt="${director.name}">
      <h3>${director.name}</h3>
      <p>Director</p>
    `;
    staffContainer.appendChild(staffCard);
  }
  const writers = crewArray.filter(person1 => person1.job === 'Writer' || person1.job === 'Screenplay').slice(0, 6);
  writers.forEach(crew => {
    const crewCard = document.createElement('div');
    crewCard.classList.add('staff-item'); 
    crewCard.innerHTML = `
       <img src = "https://image.tmdb.org/t/p/w185${crew.profile_path}" alt = "${crew.name}"> 
       <h3>${crew.name}</h3>
       <p>${crew.job}</p>
    `;
    staffContainer.appendChild(crewCard); 
  });
}

function populateRecommendations(recArray) {
  const recContainer = document.querySelector('.recommended .show-grid');
  recContainer.innerHTML = ''; 
  const recsToShow = recArray.slice(0, 5);
  recsToShow.forEach(movie => {
    const recCard = document.createElement('article');
    recCard.classList.add('show-card');
    recCard.innerHTML = `
      <a href="about.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w342${movie.poster_path}" alt="${movie.title}">
        <div class="show-content">
          <h3>${movie.title}</h3>
        </div>
      </a>
    `;
    recContainer.appendChild(recCard);
  });
}
getMoviedetails();