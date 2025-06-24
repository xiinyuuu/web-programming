const BASE_URL = '/api/tmdb';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

document.addEventListener("DOMContentLoaded", async () => {
  const movie = JSON.parse(sessionStorage.getItem('selectedMovie'));

  if (movie) {
    document.querySelector('#movie-title').textContent = movie.title;

    // Fetch additional details like rating, duration, etc.
    await fetchAndDisplayMovieDetails(movie.id);
  } else {
    document.querySelector('#movie-details').innerHTML = "<p class='text-light'>Movie not found.</p>";
  }
});

async function fetchAndDisplayMovieDetails(movieId) {
  try {
    const res = await fetch(`${BASE_URL}/movies/${movieId}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const movieDetails = await res.json();

    const releaseYear = movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : 'N/A';
    document.querySelector('#movie-year').innerHTML = `<strong>Year:</strong> ${releaseYear}`;

    const genres = movieDetails.genres && movieDetails.genres.length > 0 ? movieDetails.genres.map(g => g.name).join(', ') : 'N/A';
    document.querySelector('#movie-genre').innerHTML = `<strong>Genre:</strong> ${genres}`;

    document.querySelector('#movie-details img').src = movieDetails.poster_path;
    document.querySelector('#movie-details img').alt = movieDetails.title;
    document.querySelector('#movie-duration').innerHTML = `<strong>Duration:</strong> ${movieDetails.runtime || 'N/A'} mins`;
    document.querySelector('#movie-synopsis').innerHTML = `<strong>Synopsis:</strong> ${movieDetails.overview || 'No synopsis available.'}`;

    // Call to fetch and display cast
    fetchAndDisplayCast(movieId);

    document.querySelector('#movie-rating').innerHTML = `<strong>Average Rating:</strong> ${(movieDetails.vote_average / 2).toFixed(1)} ${generateStars(movieDetails.vote_average / 2)}`;

    // Set data attributes for the watchlist button
    const watchlistBtn = document.getElementById('add-to-watchlist-btn');
    if (watchlistBtn) {
      watchlistBtn.dataset.movieId = movieDetails.id;
      watchlistBtn.dataset.title = movieDetails.title;
      watchlistBtn.dataset.poster = movieDetails.poster_path;
    }
  } catch (error) {
    console.error('Error fetching movie details:', error);
    document.querySelector('#movie-details').innerHTML = "<p class='text-light'>Error loading movie details.</p>";
  }
}

// Star generator
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push('<i class="bi bi-star-fill"></i>');
  }

  if (halfStar) {
    stars.push('<i class="bi bi-star-half"></i>');
  }

  for (let i = stars.length; i < 5; i++) {
    stars.push('<i class="bi bi-star"></i>');
  }

  return stars.join(' ');
}

async function fetchAndDisplayCast(movieId) {
  try {
    const response = await fetch(`${BASE_URL}/movies/${movieId}/credits`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const cast = data.cast;

    const castContainer = document.querySelector('#actorSection');
    castContainer.innerHTML = ''; // Clear existing

    cast.forEach(actor => {
      const col = document.createElement('div');
      col.className = 'col-auto';

      const actorCard = document.createElement('div');
      actorCard.className = 'text-center';

      actorCard.innerHTML = `
        <img src="${actor.profile_path ? IMAGE_BASE + actor.profile_path : '/images/default-profile.webp'}" alt="${actor.name}" class="actor-img">
        <p class="mt-2">${actor.name}</p>
      `;

      const link = document.createElement('a');
      link.href = '/actor-profile.html';
      link.className = 'text-decoration-none text-light';

      link.addEventListener('click', () => {
        sessionStorage.setItem('selectedActor', JSON.stringify({
          id: actor.id,
          name: actor.name,
          profile_path: actor.profile_path ? IMAGE_BASE + actor.profile_path : '/images/default-profile.webp'
        }));
      });

      link.appendChild(actorCard);
      col.appendChild(link);
      castContainer.appendChild(col);
    });
  } catch (error) {
    console.error('Error fetching cast:', error);
    document.querySelector('#actorSection').innerHTML = "<p class='text-light'>Error loading cast information.</p>";
  }
}


