const BASE_URL = '/api/tmdb'; // This should match your backend route prefix
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

document.addEventListener("DOMContentLoaded", async () => {
  const movieCache = sessionStorage.getItem("trendingMovies");
  const actorCache = sessionStorage.getItem("trendingActors");

  if (movieCache && actorCache) {
    renderTrendingMovies(JSON.parse(movieCache));
    renderTrendingActors(JSON.parse(actorCache));
    return;
  }

  try {
    const [movies, actors] = await Promise.all([
      fetchTrendingMovies(),
      fetchTrendingActors()
    ]);

    sessionStorage.setItem("trendingMovies", JSON.stringify(movies));
    sessionStorage.setItem("trendingActors", JSON.stringify(actors));

    renderTrendingMovies(movies);
    renderTrendingActors(actors);
  } catch (error) {
    console.error("Failed to fetch trending data:", error);
  }
});

async function fetchTrendingMovies() {
  const res = await fetch(`${BASE_URL}/trending/movies`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

async function fetchTrendingActors() {
  const res = await fetch(`${BASE_URL}/trending/actors`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

function renderTrendingMovies(movies) {
  const grid = document.getElementById('movie-container');
  if (!grid) {
    console.error('Movie container not found');
    return;
  }
  
  grid.innerHTML = '';

  movies.forEach((movie, index) => {
    const col = document.createElement('div');
    col.className = 'col';

    const card = document.createElement('div');
    card.className = 'card movie-card text-center';
    card.innerHTML = `
      <div class="ranking-badge">${index + 1}</div>
      <div class="card-body p-1">
        <h6 class="movie-title">${movie.title}</h6>
      </div>
    `;

    // Create poster link
    const posterLink = document.createElement('a');
    posterLink.href = '/moviedesc.html';
    posterLink.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.setItem('selectedMovie', JSON.stringify(movie));
      window.location.href = '/moviedesc.html';
    });
    posterLink.innerHTML = `<img src="${movie.img}" class="card-img-top movie-img" alt="${movie.title}">`;

    // Insert poster link at the top of the card
    card.insertBefore(posterLink, card.firstChild.nextSibling);

    col.appendChild(card);
    grid.appendChild(col);
  });
}

function renderTrendingActors(actors) {
  const grid = document.getElementById('actorSection');
  if (!grid) {
    console.error('Actor section not found in the DOM');
    return;
  }
  
  grid.innerHTML = '';

  actors.forEach(actor => {
    const col = document.createElement('div');
    col.className = 'col';

    const link = document.createElement('a');
    link.href = '/actor-profile.html';
    link.className = 'text-decoration-none text-light';

    const card = document.createElement('div');
    card.className = 'card actor-card text-center';
    card.innerHTML = `
      <div class="actor-card text-center">
        <img src="${actor.image}" class="card-img-top actor-img" alt="${actor.name}">
      <p class="actor-name text-light">${actor.name}</p>
      </div>
    `;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Store complete actor data
      const actorData = {
        id: actor.id,
        name: actor.name,
        image: actor.image,
        profile_path: actor.profile_path,
        popularity: actor.popularity,
        known_for: actor.known_for
      };
      sessionStorage.setItem('selectedActor', JSON.stringify(actorData));
      window.location.href = '/actor-profile.html';
    });

    link.appendChild(card);
    col.appendChild(link);
    grid.appendChild(col);
  });
}

