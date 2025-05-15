const API_KEY = 'b855267d7a05ecc45792618a1e73a27b';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

let movies = [];

// Load movies when the DOM content is loaded
document.addEventListener("DOMContentLoaded", async () => {
  const cached = sessionStorage.getItem("tmdbMovies");

  if (cached) {
    movies = JSON.parse(cached);
    renderMovies();
    return;
  }

  await fetchMovies();

  if (movies.length > 0) {
    sessionStorage.setItem("tmdbMovies", JSON.stringify(movies));
    renderMovies();
  }
});

// Fetch popular movies
async function fetchMovies() {
  const movieIds = new Set();

  for (let page = 1; page <= 40; page++) {
    try {
      const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
      const data = await res.json();
      if (!data.results) continue;

      for (const movie of data.results) {
        if (movieIds.has(movie.id)) continue;
        movieIds.add(movie.id);

        // Store only basic information (id, title, image)
        movies.push({
          id: movie.id,
          title: movie.title,
          img: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'images/damsel.webp'
        });
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
    }
  }

  console.log("Fetched movies:", movies.length);
}

