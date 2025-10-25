const shows = [
  { title: "Stranger Things", year: 2024, img: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg" },
  { title: "Money Heist", year: 2021, img: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg" },
  { title: "Breaking Bad", year: 2013, img: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg" },
  { title: "Peaky Blinders", year: 2022, img: "https://image.tmdb.org/t/p/w500/bj7UqfL9Zz09VG77xUP8yR4AfJd.jpg" },
  { title: "The Witcher", year: 2023, img: "https://image.tmdb.org/t/p/w500/zrPpUlehQaBf8YX2NrVrKK8IEpf.jpg" },
  { title: "Game of Thrones", year: 2019, img: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg" },
  { title: "The Boys", year: 2024, img: "https://image.tmdb.org/t/p/w500/mY7SeH4HFFxW1hiI6cWzX1zr3vB.jpg" },
  { title: "Loki", year: 2023, img: "https://image.tmdb.org/t/p/w500/voHUmluYmKyleFkTu3lOXQG702u.jpg" },
  { title: "Dark", year: 2020, img: "https://image.tmdb.org/t/p/w500/1BP4xYv9ZG4ZVHkL7ocOziBbSYH.jpg" },
  { title: "The Mandalorian", year: 2023, img: "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg" },
  { title: "Wednesday", year: 2023, img: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg" },
  { title: "Squid Game", year: 2022, img: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg" },
  { title: "House of the Dragon", year: 2024, img: "https://image.tmdb.org/t/p/w500/7QMsOTMUsRkkZnxGp0niK6Jzr6C.jpg" },
  { title: "The Crown", year: 2023, img: "https://image.tmdb.org/t/p/w500/8E05qGz9YfC4G38nAqC0syFZsPq.jpg" },
  { title: "Vikings", year: 2020, img: "https://image.tmdb.org/t/p/w500/bQLrHIRNEkE3PdIWQrZHynQZazu.jpg" },
  { title: "The Last of Us", year: 2024, img: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg" },
  { title: "Sherlock", year: 2017, img: "https://image.tmdb.org/t/p/w500/f9zGxLHGyQB10cMDZNY5ZcGKhZi.jpg" },
  { title: "The Flash", year: 2023, img: "https://image.tmdb.org/t/p/w500/lJA2RCMfsWoskqlQhXPSLFQGXEJ.jpg" },
  { title: "Manifest", year: 2023, img: "https://image.tmdb.org/t/p/w500/kuW7y3fw7Ytzo3Y8HkUCBwS4gdl.jpg" },
  { title: "The Umbrella Academy", year: 2024, img: "https://image.tmdb.org/t/p/w500/scZlQQYnDVlnpxFTxaIv2g0BWnL.jpg" }
];

const grid = document.getElementById("showsGrid");

shows.forEach(show => {
  const div = document.createElement("div");
  div.classList.add("show");
  div.innerHTML = `
    <img src="${show.img}" alt="${show.title}">
    <div class="show-info">
      <h3>${show.title}</h3>
      <p>${show.year}</p>
    </div>
  `;
  grid.appendChild(div);
});
