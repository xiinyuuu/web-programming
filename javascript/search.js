const BASE_URL = '/api/tmdb';
let currentMoviePage = 1;
let currentActorPage = 1;
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

async function performSearch(query, moviePage = 1, actorPage = 1) {
    try {
        console.log('Performing search for:', query, 'moviePage:', moviePage, 'actorPage:', actorPage);
        const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}&page=${moviePage}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Search results:', data);

        // Separate movies and actors
        const movies = data.results.filter(item => item.type === 'movie');
        const actors = data.results.filter(item => item.type === 'actor');

        // Update pagination info
        currentMoviePage = moviePage;
        currentActorPage = actorPage;
        totalMoviePages = Math.ceil(movies.length / 10);
        totalActorPages = Math.ceil(actors.length / 10);
        
        renderMovies(movies);
        renderActors(actors);
        updateMoviePagination();
        updateActorPagination();

        // Show/hide sections based on results
        const movieSection = document.getElementById('movieResults');
        const actorSection = document.getElementById('actorResults');
        
        movieSection.style.display = movies.length > 0 ? 'block' : 'none';
        actorSection.style.display = actors.length > 0 ? 'block' : 'none';

        // Show no results message if both sections are empty
        if (movies.length === 0 && actors.length === 0) {
            const container = document.querySelector('.container');
            const noResults = document.createElement('div');
            noResults.className = 'text-center mt-4';
            noResults.innerHTML = '<p class="text-light">No results found with images. Try a different search term.</p>';
            container.appendChild(noResults);
        }
    } catch (error) {
        console.error('Error performing search:', error);
        showError('Error performing search. Please try again.');
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
    updatePagination('moviePagination', currentMoviePage, totalMoviePages, changeMoviePage);
}

function updateActorPagination() {
    updatePagination('actorPagination', currentActorPage, totalActorPages, changeActorPage);
}

function updatePagination(containerId, currentPage, totalPages, changePageFunc) {
    const pagination = document.getElementById(containerId);
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `
        <button class="page-link" ${currentPage === 1 ? 'disabled' : ''} onclick="${changePageFunc.name}(${currentPage - 1})">
            <i class="bi bi-arrow-left"></i>
        </button>
    `;
    pagination.appendChild(prevLi);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            li.innerHTML = `
                <button class="page-link" onclick="${changePageFunc.name}(${i})">${i}</button>
            `;
            pagination.appendChild(li);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const li = document.createElement('li');
            li.className = 'page-item disabled';
            li.innerHTML = '<span class="page-link">...</span>';
            pagination.appendChild(li);
        }
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `
        <button class="page-link" ${currentPage === totalPages ? 'disabled' : ''} onclick="${changePageFunc.name}(${currentPage + 1})">
            <i class="bi bi-arrow-right"></i>
        </button>
    `;
    pagination.appendChild(nextLi);
}

function changeMoviePage(page) {
    if (page < 1 || page > totalMoviePages) return;
    performSearch(currentQuery, page, currentActorPage);
    window.scrollTo(0, 0);
}

function changeActorPage(page) {
    if (page < 1 || page > totalActorPages) return;
    performSearch(currentQuery, currentMoviePage, page);
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
