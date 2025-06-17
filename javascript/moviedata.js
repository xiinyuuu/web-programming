const BASE_URL = '/api/tmdb';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

let movies = [];

// Load movies when the DOM content is loaded
document.addEventListener("DOMContentLoaded", async () => {
  const cached = sessionStorage.getItem("tmdbMovies");

  if (cached) {
    movies.length = 0; // Clear existing array
    movies.push(...JSON.parse(cached));
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
      const res = await fetch(`${BASE_URL}/movies/popular?page=${page}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (!data.results) continue;

      for (const movie of data.results) {
        if (movieIds.has(movie.id)) continue;
        movieIds.add(movie.id);
        movies.push(movie);
      }

      // If we've reached the last page, stop fetching
      if (page >= data.total_pages) {
        break;
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      break; // Stop on error
    }
  }

  console.log("Fetched movies:", movies.length);
}

