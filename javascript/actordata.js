const BASE_URL = '/api/tmdb';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

let actors = [];

// Set default values if not already set
window.actorCurrentPage = window.actorCurrentPage || 1;
window.actorsPerPage = window.actorsPerPage || 25;

document.addEventListener("DOMContentLoaded", async () => {
  console.log('Actordata.js DOMContentLoaded event fired');
  
  const cached = sessionStorage.getItem("tmdbActors");

  if (cached) {
    console.log('Using cached actors data');
    actors = JSON.parse(cached);
    renderActors();
    setupActorPagination();
    return;
  }

  console.log('No cached data, fetching actors from API...');
  await fetchActors();

  if (actors.length > 0) {
    console.log(`Successfully fetched ${actors.length} actors`);
    sessionStorage.setItem("tmdbActors", JSON.stringify(actors));
    renderActors();
    setupActorPagination();
  } else {
    console.error('No actors fetched from API');
  }
});

async function fetchActors() {
  console.log('fetchActors function called');
  const actorIds = new Set();

  for (let page = 1; page <= 30; page++) {
    try {
      console.log(`Fetching actors page ${page}...`);
      const res = await fetch(`${BASE_URL}/actors/popular?page=${page}`);
      console.log(`API response status: ${res.status}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log(`Page ${page} returned ${data.results?.length || 0} actors`);
      
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
        console.log(`Reached last page (${data.total_pages}), stopping fetch`);
        break;
      }

    } catch (error) {
      console.error(`Error fetching actors page ${page}:`, error);
      break; // Stop on error
    }
  }

  console.log("Total actors fetched:", actors.length);
}

function renderActors() {
  console.log('renderActors function called');
  const container = document.querySelector('#actorGridContainer');
  if (!container) {
    console.error('Actor grid container not found');
    return;
  }

  console.log(`Rendering ${actors.length} actors`);
  container.innerHTML = '';

  // Filter out actors without images first
  const filteredActors = actors.filter(actor => actor.image && !actor.image.includes('default-profile.webp'));
  console.log(`After filtering, ${filteredActors.length} actors have valid images`);

  // Paginate the filtered list
  const start = ((window.actorCurrentPage || 1) - 1) * (window.actorsPerPage || 25);
  const end = start + (window.actorsPerPage || 25);
  const actorsToShow = filteredActors.slice(start, end);
  console.log(`Showing actors ${start + 1} to ${end} (${actorsToShow.length} actors)`);

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
  
  console.log('Actor rendering complete');
}

// Setup pagination for actors
function setupActorPagination() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageIndicator = document.getElementById('pageIndicator');

  function updatePaginationButtons() {
    if (prevBtn) prevBtn.disabled = window.actorCurrentPage === 1;
    if (nextBtn) nextBtn.disabled = window.actorCurrentPage >= Math.ceil(actors.length / window.actorsPerPage);
    if (pageIndicator) pageIndicator.textContent = `Page ${window.actorCurrentPage}`;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (window.actorCurrentPage > 1) {
        window.actorCurrentPage--;
        renderActors();
        updatePaginationButtons();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (window.actorCurrentPage < Math.ceil(actors.length / window.actorsPerPage)) {
        window.actorCurrentPage++;
        renderActors();
        updatePaginationButtons();
      }
    });
  }

  // Initial update
  updatePaginationButtons();
}


    

