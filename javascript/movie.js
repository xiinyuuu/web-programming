const API_KEY = 'b855267d7a05ecc45792618a1e73a27b';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

document.addEventListener("DOMContentLoaded", async () => {
  const movie = JSON.parse(sessionStorage.getItem('selectedMovie'));

  if (movie) {
    document.querySelector('#movie-title').textContent = movie.title;
    document.querySelector('#movie-details img').src = movie.img;
    document.querySelector('#movie-details img').alt = movie.title;

    // Fetch additional details like rating, duration, etc.
    await fetchAndDisplayMovieDetails(movie.id);
  } else {
    document.querySelector('#movie-details').innerHTML = "<p class='text-light'>Movie not found.</p>";
  }
});

async function fetchAndDisplayMovieDetails(movieId) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
    const movieDetails = await res.json();

    document.querySelector('#movie-duration').innerHTML = `<strong>Duration:</strong> ${movieDetails.runtime || 'N/A'} mins`;
    document.querySelector('#movie-synopsis').innerHTML = `<strong>Synopsis:</strong> ${movieDetails.overview || 'No synopsis available.'}`;

    // Call to fetch and display cast
    fetchAndDisplayCast(movieId);

    document.querySelector('#movie-rating').innerHTML = `<strong>Average Rating:</strong> ${(movieDetails.vote_average / 2).toFixed(1)} ${generateStars(movieDetails.vote_average / 2)}`;
  } catch (error) {
    console.error('Error fetching movie details:', error);
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
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`);
    const data = await response.json();
    let cast = data.cast.slice(0, 6); // Top 6 actors

    // Filter out actors without a profile picture
    cast = cast.filter(actor => actor.profile_path);

    // Filter names to only include those with English letters (a-z, A-Z, spaces, dots, apostrophes, hyphens)
    cast = cast.filter(actor => /^[a-zA-Z\s.'-]+$/.test(actor.name));

    // If there are less than 6 actors with profile pictures and English names, fetch more actors until we have 6
    while (cast.length < 6) {
      const nextActor = data.cast.find(actor => actor.profile_path && !cast.includes(actor) && /^[a-zA-Z\s.'-]+$/.test(actor.name));
      if (nextActor) {
        cast.push(nextActor);
      } else {
        // No more actors meeting criteria, break loop to avoid infinite loop
        break;
      }
    }

    const castContainer = document.querySelector('#actorSection');
    castContainer.innerHTML = ''; // Clear existing

    cast.forEach(actor => {
      const profilePath = `https://image.tmdb.org/t/p/w185${actor.profile_path}`;

      const col = document.createElement('div');
      col.className = 'col-auto';

      const actorCard = document.createElement('div');
      actorCard.className = 'text-center';

      actorCard.innerHTML = `
        <img src="${profilePath}" alt="${actor.name}" class="actor-img">
        <p class="mt-2">${actor.name}</p>
      `;

      const link = document.createElement('a');
      link.href = '../html/actor-profile.html';
      link.className = 'text-decoration-none text-light';

      link.addEventListener('click', () => {
        sessionStorage.setItem('selectedActor', JSON.stringify({
          id: actor.id,
          name: actor.name,
          image: profilePath
        }));
      });

      link.appendChild(actorCard);
      col.appendChild(link);
      castContainer.appendChild(col);
    });
  } catch (error) {
    console.error('Error fetching cast:', error);
  }
}


