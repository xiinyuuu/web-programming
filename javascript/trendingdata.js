const API_KEY = 'b855267d7a05ecc45792618a1e73a27b';
const BASE_URL = 'https://api.themoviedb.org/3';
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
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  const data = await res.json();
  return (data.results || []).slice(0, 10).map(movie => ({
    id: movie.id,
    title: movie.title,
    img: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'images/damsel.webp'
  }));
}

async function fetchTrendingActors() {
  const res = await fetch(`${BASE_URL}/trending/person/week?api_key=${API_KEY}`);
  const data = await res.json();
  return (data.results || []).filter(p => p.known_for_department === "Acting").slice(0, 6).map(person => ({
    id: person.id,
    name: person.name,
    image: person.profile_path ? `${IMAGE_BASE}${person.profile_path}` : "images/default-profile.webp"
  }));
}

function renderTrendingMovies(movies) {
  const grid = document.getElementById('movie-container');
    grid.innerHTML = '';

    movies.forEach((movie, index) => {
      const col = document.createElement('div');
      col.className = 'col';

      const card = document.createElement('div');
      card.className = 'card movie-card text-center';
      card.innerHTML = `
        <div class="ranking-badge">${index + 1}</div>
        <img src="${movie.img}" class="card-img-top movie-img" alt="${movie.title}">
        <div class="card-body p-1">
          <h6 class="movie-title">${movie.title}</h6>
        </div>
      `;

      const link = document.createElement('a');
      link.href = '../html/moviedesc.html';
      link.className = 'text-decoration-none text-light';
      link.addEventListener('click', () => {
        sessionStorage.setItem('selectedMovie', JSON.stringify(movie));
      });

      link.appendChild(card);
      col.appendChild(link);
      grid.appendChild(col);
    });
}





function renderTrendingActors(actors) {
  const grid = document.getElementById('actorSection'); // Make sure this matches your HTML
  grid.innerHTML = '';

  actors.forEach(actor => {
    const col = document.createElement('div');
    col.className = 'col';

    const card = document.createElement('div');
    card.className = 'card actor-card text-center';
    card.innerHTML = `
      <div class="actor-card text-center">
        <img src="${actor.image}" class="card-img-top actor-img" alt="${actor.name}">
        <p class="actor-name text-light">${actor.name}</p>
      </div>
    `;

    const link = document.createElement('a');
    link.href = 'actor-profile.html'; 
    link.className = 'text-decoration-none text-light';

    link.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.setItem('selectedActor', JSON.stringify(actor));
      window.location.href = '../html/actor-profile.html';
    });

    link.appendChild(card);
    col.appendChild(link);
    grid.appendChild(col);
  });
}

