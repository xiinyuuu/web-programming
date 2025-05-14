const API_KEY = 'b855267d7a05ecc45792618a1e73a27b';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const genresMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary",
  18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie", 53: "Thriller",
  10752: "War", 37: "Western"
};

let movies = [];

document.addEventListener("DOMContentLoaded", async () => {
  const cached = sessionStorage.getItem("tmdbMovies");

  if (cached) {
    movies = JSON.parse(cached);
    renderMovies();
    return;
  }

  await fetchMoviesFast();

  if (movies.length > 0) {
    sessionStorage.setItem("tmdbMovies", JSON.stringify(movies));
    renderMovies();
  }
});

async function fetchMoviesFast() {
  const movieIds = new Set();

  for (let page = 1; page <= 10; page++) {
    try {
      const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
      const data = await res.json();

      if (!data.results) continue;

      for (const movie of data.results) {
        if (movieIds.has(movie.id)) continue;
        movieIds.add(movie.id);

        try {
          const detailsRes = await fetch(`${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=en-US`);
          const details = await detailsRes.json();

          const creditsRes = await fetch(`${BASE_URL}/movie/${movie.id}/credits?api_key=${API_KEY}`);
          const credits = await creditsRes.json();

          const actors = (credits.cast || []).slice(0, 6).map(actor => actor.name).join(', ') || "Unknown cast";

          movies.push({
            id: movie.id,
            title: movie.title,
            img: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'images/damsel.webp',
            rating: (movie.vote_average / 2).toFixed(1),
            year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : "Unknown",
            language: movie.original_language || "Unknown",
            popularity: Math.round(movie.popularity),
            genre: movie.genre_ids.map(id => genresMap[id] || "Other"),
            duration: details.runtime ? `${details.runtime} mins` : "N/A",
            actors: actors,
            synopsis: movie.overview || "No synopsis available."
          });

        } catch (err) {
          console.warn(`Error getting details for movie ${movie.id}:`, err);
        }
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
    }
  }

  console.log("Fetched movies:", movies.length);
}