const BASE_URL = '/api/tmdb';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

let actors = [];

document.addEventListener("DOMContentLoaded", async () => {
  const cached = sessionStorage.getItem("tmdbActors");

  if (cached) {
    actors = JSON.parse(cached);
    renderActors();
    return;
  }

  await fetchActors();

  if (actors.length > 0) {
    sessionStorage.setItem("tmdbActors", JSON.stringify(actors));
    renderActors();
  }
});

async function fetchActors() {
  const actorIds = new Set();

  for (let page = 1; page <= 30; page++) {
    try {
      const res = await fetch(`${BASE_URL}/actors/popular?page=${page}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (!data.results || data.results.length === 0) break;

      for (const person of data.results) {
        if (actorIds.has(person.id)) continue;
        actorIds.add(person.id);
        actors.push({
          id: person.id,
          name: person.name,
          image: person.image
        });
      }

      // If we've reached the last page, stop fetching
      if (page >= data.total_pages) {
        break;
      }

    } catch (error) {
      console.error("Error fetching actors:", error);
      break; // Stop on error
    }
  }

  console.log("Total actors fetched:", actors.length);
}

function renderActors() {
  const container = document.querySelector('#actorGridContainer');
  if (!container) {
    console.error('Actor grid container not found');
    return;
  }

  container.innerHTML = '';

  // Get the current page from the global variable (set in actor.html)
  const start = ((window.currentPage || 1) - 1) * (window.actorsPerPage || 25);
  const end = start + (window.actorsPerPage || 25);
  const actorsToShow = actors.slice(start, end);

  actorsToShow.forEach(actor => {
    const col = document.createElement('div');
    col.className = 'col';

    const card = document.createElement('div');
    card.className = 'card actor-card text-center';

    const link = document.createElement('a');
    link.href = 'actor-profile.html';
    link.className = 'text-decoration-none text-light';

    link.addEventListener('click', () => {
      sessionStorage.setItem('selectedActor', JSON.stringify(actor));
    });

    card.innerHTML = `
      <img src="${actor.image}" class="card-img-top actor-img" alt="${actor.name}">
      <div class="card-body p-2">
        <h6 class="actor-name">${actor.name}</h6>
      </div>
    `;

    link.appendChild(card);
    col.appendChild(link);
    container.appendChild(col);
  });
}


    

