const BASE_URL = '/api/tmdb';
let allMovies = [];
let allActors = [];
let currentMoviePage = 1;
let currentActorPage = 1;
const MOVIES_PER_PAGE = 15;
const ACTORS_PER_PAGE = 15;
let totalMoviePages = 1;
let totalActorPages = 1;
let currentQuery = '';

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("query")?.toLowerCase().trim() || "";

const resultsContainer = document.getElementById("results");
const resultCount = document.getElementById("result-count");
let count = 0;

document.addEventListener('DOMContentLoaded', async () => {
    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    
    if (query) {
        currentQuery = query;
        document.getElementById('searchInput').value = query;
        await performSearch(query);
    }
});

async function performSearch(query) {
    showSearchLoadingSpinner();
    await fetchAllResults(query);
    currentMoviePage = 1;
    currentActorPage = 1;
    renderMoviesPage(currentMoviePage);
    renderActorsPage(currentActorPage);

    // Show "no results" message if both are empty
    if (allMovies.length === 0 && allActors.length === 0) {
        showNoResultsMessage(query);
    } else {
        // Remove the message if it exists and there are results
        let existing = document.getElementById('no-results-message');
        if (existing) existing.remove();
    }
}

function showSearchLoadingSpinner() {
    // Show spinner in both movie and actor sections
    const movieContainer = document.querySelector('#movieResults .row');
    const actorContainer = document.querySelector('#actorResults .row');
    if (movieContainer) {
        movieContainer.innerHTML = `<div class="text-light text-center w-100"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>`;
    }
    if (actorContainer) {
        actorContainer.innerHTML = `<div class="text-light text-center w-100"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>`;
    }
}

function renderMovies(movies) {
    const container = document.querySelector('#movieResults .row');
    container.innerHTML = '';

    movies.forEach(movie => {
        const col = document.createElement('div');
        col.className = 'col';

        const card = document.createElement('div');
        card.className = 'card movie-card text-center';

        const link = document.createElement('a');
        link.href = '/moviedesc.html';
        link.className = 'text-decoration-none text-light';

        link.addEventListener('click', () => {
            sessionStorage.setItem('selectedMovie', JSON.stringify({
                id: movie.id,
                title: movie.title,
                img: movie.img
            }));
        });

        card.innerHTML = `
            <img src="${movie.img}" 
                 class="card-img-top movie-img" 
                 alt="${movie.title}"
                 onerror="this.style.display='none'; this.parentElement.style.display='none';">
            <div class="card-body">
                <h6 class="movie-title">${movie.title}</h6>
            </div>
        `;

        link.appendChild(card);
        col.appendChild(link);
        container.appendChild(col);
    });
}

function renderActors(actors) {
    const container = document.querySelector('#actorResults .row');
    container.innerHTML = '';

    actors.forEach(actor => {
        const col = document.createElement('div');
        col.className = 'col';

        const card = document.createElement('div');
        card.className = 'card actor-card text-center';

        const link = document.createElement('a');
        link.href = '/actor-profile.html';
        link.className = 'text-decoration-none text-light';

        link.addEventListener('click', () => {
            sessionStorage.setItem('selectedActor', JSON.stringify({
                id: actor.id,
                name: actor.name,
                image: actor.image
            }));
        });

        card.innerHTML = `
            <img src="${actor.image}" 
                 class="actor-img" 
                 alt="${actor.name}"
                 onerror="this.style.display='none'; this.parentElement.style.display='none';">
            <div class="card-body">
                <h6 class="actor-name">${actor.name}</h6>
            </div>
        `;

        link.appendChild(card);
        col.appendChild(link);
        container.appendChild(col);
    });
}

function updateMoviePagination() {
    const totalPages = Math.ceil(allMovies.length / MOVIES_PER_PAGE);
    updatePagination('moviePagination', currentMoviePage, totalPages, changeMoviePage);
}

function updateActorPagination() {
    const totalPages = Math.ceil(allActors.length / ACTORS_PER_PAGE);
    updatePagination('actorPagination', currentActorPage, totalPages, changeActorPage);
}

function updatePagination(containerId, currentPage, totalPages, changePageFunc) {
    const pagination = document.getElementById(containerId);
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Create a flex container
    const flex = document.createElement('div');
    flex.className = 'd-flex justify-content-center align-items-center gap-2';

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-outline-light';
    prevBtn.disabled = currentPage === 1;
    prevBtn.innerHTML = '<i class="bi bi-arrow-left"></i>';
    prevBtn.onclick = () => changePageFunc(currentPage - 1);
    flex.appendChild(prevBtn);

    // Page indicator
    const pageIndicator = document.createElement('span');
    pageIndicator.className = 'text-light mx-2 fw-bold';
    pageIndicator.textContent = `Page ${currentPage}`;
    flex.appendChild(pageIndicator);

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-outline-light';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.innerHTML = '<i class="bi bi-arrow-right"></i>';
    nextBtn.onclick = () => changePageFunc(currentPage + 1);
    flex.appendChild(nextBtn);

    pagination.appendChild(flex);
}

function changeMoviePage(page) {
    const totalPages = Math.ceil(allMovies.length / MOVIES_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    currentMoviePage = page;
    renderMoviesPage(currentMoviePage);
    window.scrollTo(0, 0);
}

function changeActorPage(page) {
    const totalPages = Math.ceil(allActors.length / ACTORS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    currentActorPage = page;
    renderActorsPage(currentActorPage);
    window.scrollTo(0, 0);
}

function showError(message) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <h3 class="section-title">Search Results</h3>
        <hr class="section-divider">
        <div class="text-center">
            <p class="text-light">${message}</p>
        </div>
    `;
}

// Handle search form submission
document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        currentQuery = query;
        currentMoviePage = 1;
        currentActorPage = 1;
        // Update URL without reloading the page
        const url = new URL(window.location);
        url.searchParams.set('query', query);
        window.history.pushState({}, '', url);
        performSearch(query);
    }
});

function createCard(type, nameOrTitle, imgPath, id) {
  if (!imgPath) return;  

  const col = document.createElement("div");
  col.className = "col";

  const imageUrl = imgPath ? `${BASE_IMAGE_URL}${imgPath}` :
    (type === "movie" ? "../images/default_movie.jpg" : "../images/default_actor.jpg");

  col.innerHTML = `
    <div class="card movie-card text-center search-result-card"
         data-type="${type}"
         data-id="${id}"
         data-name="${nameOrTitle}"
         data-image="${imageUrl}">
      <img src="${imageUrl}" class="card-img-top movie-img" alt="${nameOrTitle}">
      <div class="card-body p-1">
        <h6 class="movie-title">${nameOrTitle}</h6>
      </div>
    </div>
  `;
  resultsContainer.appendChild(col);
}

async function displayResults() {
  const results = await searchTMDB(query);

  results.forEach(item => {
    const queryLower = query.toLowerCase();

    if (item.media_type === "movie" && item.poster_path) {
      const title = (item.title || item.name || "").toLowerCase();

      if (title.startsWith(queryLower) || title.split(/\s+/).some(word => word === queryLower)) {
        createCard("movie", item.title || item.name, item.poster_path, item.id);
        count++;
      }

    } else if (item.media_type === "person" && item.profile_path) {
      const name = (item.name || "").toLowerCase();

      if (name.startsWith(queryLower) || name.split(/\s+/).some(word => word === queryLower)) {
        createCard("actor", item.name, item.profile_path, item.id);
        count++;
      }
    }
  });

  resultCount.textContent = count > 0
    ? `${count} result(s) found for "${query}"`
    : `No results found for "${query}".`;

  setupSearchResultClickHandlers();
}


function setupSearchResultClickHandlers() {
  const searchResults = document.querySelectorAll(".search-result-card");

  searchResults.forEach(card => {
    card.addEventListener("click", () => {
      const type = card.getAttribute("data-type");
      const id = parseInt(card.getAttribute("data-id"));
      const name = card.getAttribute("data-name");
      const image = card.getAttribute("data-image");

      if (type === "movie") {
        const selectedMovie = { id, title: name, img: image };
        sessionStorage.setItem("selectedMovie", JSON.stringify(selectedMovie));
        window.location.href = "../html/moviedesc.html";
      } else if (type === "actor") {
        const selectedActor = { id, name, image };
        sessionStorage.setItem("selectedActor", JSON.stringify(selectedActor));
        window.location.href = "../html/actor-profile.html";
      }
    });
  });
}


// Start searching and displaying
displayResults();

async function fetchAllResults(query) {
    allMovies = [];
    allActors = [];
    // Fetch first 5 pages (adjust as needed)
    for (let page = 1; page <= 5; page++) {
        const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}`);
        const data = await res.json();
        allMovies.push(...data.results.filter(item => item.type === 'movie'));
        allActors.push(...data.results.filter(item => item.type === 'actor'));
        // Optionally break if no more results
        if (!data.results || data.results.length === 0) break;
    }
}

function renderMoviesPage(page) {
    const container = document.querySelector('#movieResults .row');
    const section = document.getElementById('movieResults');
    const start = (page - 1) * MOVIES_PER_PAGE;
    const end = start + MOVIES_PER_PAGE;
    const moviesToShow = allMovies.slice(start, end);

    if (allMovies.length === 0) {
        section.style.display = 'none';
        return;
    } else {
        section.style.display = 'block';
    }

    container.innerHTML = '';
    moviesToShow.forEach(movie => {
        const col = document.createElement('div');
        col.className = 'col';

        const card = document.createElement('div');
        card.className = 'card movie-card text-center';

        const link = document.createElement('a');
        link.href = '/moviedesc.html';
        link.className = 'text-decoration-none text-light';

        link.addEventListener('click', () => {
            sessionStorage.setItem('selectedMovie', JSON.stringify({
                id: movie.id,
                title: movie.title,
                img: movie.img
            }));
        });

        card.innerHTML = `
            <img src="${movie.img}" 
                 class="card-img-top movie-img" 
                 alt="${movie.title}"
                 onerror="this.style.display='none'; this.parentElement.style.display='none';">
            <div class="card-body">
                <h6 class="movie-title">${movie.title}</h6>
            </div>
        `;

        link.appendChild(card);
        col.appendChild(link);
        container.appendChild(col);
    });
    updateMoviePagination();
}

function renderActorsPage(page) {
    const container = document.querySelector('#actorResults .row');
    const section = document.getElementById('actorResults');
    const start = (page - 1) * ACTORS_PER_PAGE;
    const end = start + ACTORS_PER_PAGE;
    const actorsToShow = allActors.slice(start, end);

    if (allActors.length === 0) {
        section.style.display = 'none';
        return;
    } else {
        section.style.display = 'block';
    }

    container.innerHTML = '';
    actorsToShow.forEach(actor => {
        const col = document.createElement('div');
        col.className = 'col';

        const card = document.createElement('div');
        card.className = 'card actor-card text-center';

        const link = document.createElement('a');
        link.href = '/actor-profile.html';
        link.className = 'text-decoration-none text-light';

        link.addEventListener('click', () => {
            sessionStorage.setItem('selectedActor', JSON.stringify({
                id: actor.id,
                name: actor.name,
                image: actor.image
            }));
        });

        card.innerHTML = `
            <img src="${actor.image}" 
                 class="actor-img" 
                 alt="${actor.name}"
                 onerror="this.style.display='none'; this.parentElement.style.display='none';">
            <div class="card-body">
                <h6 class="actor-name">${actor.name}</h6>
            </div>
        `;

        link.appendChild(card);
        col.appendChild(link);
        container.appendChild(col);
    });
    updateActorPagination();
}

function showNoResultsMessage(query) {
    // Remove any previous message
    let existing = document.getElementById('no-results-message');
    if (existing) existing.remove();

    const container = document.querySelector('.container');
    const noResults = document.createElement('div');
    noResults.id = 'no-results-message';
    noResults.className = 'text-center mt-4';
    noResults.innerHTML = `<p class="text-light">No result found for "<span class="fw-bold">${query}</span>"</p>`;
    container.appendChild(noResults);
}
