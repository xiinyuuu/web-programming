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

    // Set data attributes for the watchlist button
    const watchlistBtn = document.getElementById('add-to-watchlist-btn');
    if (watchlistBtn) {
      watchlistBtn.dataset.movieId = movieDetails.id;
      watchlistBtn.dataset.title = movieDetails.title;
      watchlistBtn.dataset.poster = movieDetails.poster_path;
    }

    // After rendering movie details, fetch trailers:
    await fetchAndDisplayTrailerButton(movieId);

    // Only set tmdbAvg in sessionStorage
    sessionStorage.setItem('tmdbAvg', (movieDetails.vote_average / 2).toString());
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
        <img src="${actor.profile_path}" alt="${actor.name}" class="actor-img">
        <p class="mt-2">${actor.name}</p>
      `;

      const link = document.createElement('a');
      link.href = '../html/actor-profile.html';
      link.className = 'text-decoration-none text-light';

      link.addEventListener('click', () => {
        sessionStorage.setItem('selectedActor', JSON.stringify({
          id: actor.id,
          name: actor.name,
          image: actor.profile_path
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

async function fetchAndDisplayTrailerButton(movieId) {
  const trailerContainer = document.getElementById('trailer-container');
  trailerContainer.innerHTML = ''; // Clear previous

  try {
    const res = await fetch(`/api/tmdb/movies/${movieId}/trailers`);
    const trailers = await res.json();
    if (trailers.length > 0) {
      // Use the first trailer with type 'Trailer' and site 'YouTube'
      const trailer = trailers.find(t => t.site === 'YouTube' && t.type === 'Trailer');
      if (trailer) {
        trailerContainer.innerHTML = `
          <button class="btn btn-play-trailer mb-3" id="playTrailerBtn">
            <i class="bi bi-play-fill"></i> Play Trailer
          </button>
        `;
        document.getElementById('playTrailerBtn').onclick = function() {
          showTrailerModal(trailer.key);
        };
      }
    }
  } catch (err) {
    // Optionally handle error
  }
}

// Show trailer in modal
function showTrailerModal(youtubeKey) {
  const modalBody = document.getElementById('trailerModalBody');
  modalBody.innerHTML = `
    <div style="position:relative; width:100%; height:400px;">
      <iframe width="100%" height="400" src="https://www.youtube.com/embed/${youtubeKey}?autoplay=1"
        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      <a href="https://www.youtube.com/watch?v=${youtubeKey}" target="_blank" 
         style="position:absolute; bottom:16px; right:16px; z-index:10; background:rgba(0,0,0,0.7); border-radius:50%; padding:8px;"
         title="Open on YouTube">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
          <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.163 3.5 12 3.5 12 3.5s-7.163 0-9.386.566a2.994 2.994 0 0 0-2.112 2.12C0 8.41 0 12 0 12s0 3.59.502 5.814a2.994 2.994 0 0 0 2.112 2.12C4.837 20.5 12 20.5 12 20.5s7.163 0 9.386-.566a2.994 2.994 0 0 0 2.112-2.12C24 15.59 24 12 24 12s0-3.59-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </a>
    </div>
  `;
  const trailerModal = new bootstrap.Modal(document.getElementById('trailerModal'));
  trailerModal.show();
}

// Stop trailer when modal closes
function stopTrailer() {
  document.getElementById('trailerModalBody').innerHTML = '';
}


