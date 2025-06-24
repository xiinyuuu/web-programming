const BASE_URL = '/api/tmdb';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const ACTORS_PER_PAGE = 20;
let actorBuffer = []; // Only actors with images
let apiPageFetched = 0; // Last API page fetched
let currentDisplayPage = 1; // 1-based

document.addEventListener("DOMContentLoaded", async () => {
  // Reset state
  actorBuffer = [];
  apiPageFetched = 0;
  currentDisplayPage = 1;
  // Fetch enough actors to fill the first page
  await ensureActorBufferFilled(currentDisplayPage);
  renderActors(currentDisplayPage);
  setupActorPagination();
});

async function fetchActorsFromApi(page) {
  const res = await fetch(`${BASE_URL}/actors/popular?page=${page}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return (data.results || []).filter(person => person.image && !person.image.includes('default-profile.webp'));
}

// Ensure buffer has enough actors to display up to the requested page
async function ensureActorBufferFilled(page) {
  const needed = page * ACTORS_PER_PAGE;
  while (actorBuffer.length < needed) {
    apiPageFetched++;
    const newActors = await fetchActorsFromApi(apiPageFetched);
    actorBuffer = actorBuffer.concat(newActors);
    // If API returns no more actors, break to avoid infinite loop
    if (newActors.length === 0) break;
  }
}

function renderActors(page) {
  const container = document.querySelector('#actorGridContainer');
  if (!container) return;
  container.innerHTML = '';

  const start = (page - 1) * ACTORS_PER_PAGE;
  const end = start + ACTORS_PER_PAGE;
  const actorsToShow = actorBuffer.slice(start, end);

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

  updatePaginationButtons();
}

function setupActorPagination() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageIndicator = document.getElementById('pageIndicator');

  if (prevBtn) {
    prevBtn.onclick = async () => {
      if (currentDisplayPage > 1) {
        currentDisplayPage--;
        renderActors(currentDisplayPage);
      }
    };
  }

  if (nextBtn) {
    nextBtn.onclick = async () => {
      currentDisplayPage++;
      await ensureActorBufferFilled(currentDisplayPage);
      renderActors(currentDisplayPage);
    };
  }

  updatePaginationButtons();
}

function updatePaginationButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageIndicator = document.getElementById('pageIndicator');

  if (prevBtn) prevBtn.disabled = currentDisplayPage === 1;
  // Next is always enabled unless you want to check for end of API
  if (pageIndicator) pageIndicator.textContent = `Page ${currentDisplayPage}`;
}


    

