const movies = [
  {
    title: "Ek Deewaniyat",
    year: 2025,
    poster: "Ek_Deewaniyat.jpg",
  },
  {
    title: "Thamma",
    year: 2025,
    poster: "Thamma_film_poster.jpg.webp",
  },
  {
    title: "Pirates of caribbean",
    year: 2017,
    poster: "Pirates.jpg",
  },
  {
    title: "Tehran",
    year: 2024,
    poster: "Tahran.webp",
  },
  {
    title: "Bahubali The Epic",
    year: 2025,
    poster: "Bahubali_The_Epic.jpg",
  },
  {
    title: "The Super Deep",
    year: 2020,
    poster: "The_SuperDeep.jpg",
  },
  {
    title: "The Witch",
    year: 2022,
    poster: "The_Witch.jpg",
  },
  {
    title: "Tabaah",
    year: 2024,
    poster: "Tabaah.jpg",
  },
  {
    title: "The Officer",
    year: 2024,
    poster: "Malyalam.jpg",
  },
  {
    title: "War2",
    year: 2025,
    poster: "war-2.jpg",
  },
  {
    title: "The Call",
    year: 2025,
    poster: "The_Call.webp",
  },
  {
    title: "The Forbidden Play",
    year: 2025,
    poster: "The_Forbidden_Play.jpg",
  },
];

const grid = document.getElementById("movieGrid");

function renderMovies(list) {
  grid.innerHTML = "";
  list.forEach((m) => {
    grid.innerHTML += `
      <div class="card">
        <div class="poster" style="background-image:url('${m.poster}')">
          ${m.badge ? `<div class="badge">${m.badge}</div>` : ""}
        </div>
        <div class="card-content">
          <div class="movie-title">${m.title}</div>
          <div class="meta">${m.year}</div>
        </div>
      </div>`;
  });
}
renderMovies(movies);

// Drawer open/close
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

// Apply + Reset
document.getElementById("applyBtn").onclick = () => {
  const year = document.getElementById("year").value;
  const sort = document.getElementById("sort").value;

  let filtered = [...movies];
  if (year !== "Default") {
    filtered = filtered.filter((m) => m.year.toString() === year);
  }

  if (sort === "Newest First") {
    filtered.sort((a, b) => b.year - a.year);
  } else {
    filtered.sort((a, b) => a.year - b.year);
  }

  renderMovies(filtered);
  closeDrawer();
};

document.getElementById("resetBtn").onclick = () => {
  document.getElementById("year").value = "Default";
  document.getElementById("genre").value = "All Genres";
  document.getElementById("sort").value = "Newest First";
  document.getElementById("region").value = "Global";
  document.getElementById("language").value = "All Languages";
  renderMovies(movies);
};

