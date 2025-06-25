const BASE_URL = '/api/filter';

let currentPage = 1;
let totalPages = 1;
let genreIdToNameMap = {};

let activeFilters = {
    genres: [],
    yearRange: null,
    sort: 'popularity.desc'
};

// DOM elements - will be initialized when DOM is ready
let MOVIE_GRID, PREV_BTN, NEXT_BTN, PAGE_INDICATOR, ACTIVE_FILTERS_DISPLAY;

// Fetch and display movies with current filters
async function fetchAndDisplayMovies() {
    try {
        MOVIE_GRID.innerHTML = `<div class="text-light text-center w-100"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>`;
        
        const queryParams = new URLSearchParams({
            page: currentPage,
            genres: activeFilters.genres.join(','),
            sort: activeFilters.sort
        });

        if (activeFilters.yearRange) {
            queryParams.append('yearRange', JSON.stringify(activeFilters.yearRange));
        }

        const response = await fetch(`${BASE_URL}/movies?${queryParams}`);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const data = await response.json();
        
        displayMovies(data.results);
        totalPages = data.total_pages;
        updatePagination();

    } catch (error) {
        console.error("Failed to fetch movies:", error);
        MOVIE_GRID.innerHTML = `<p class="text-light text-center w-100">Failed to load movies. Please try again later.</p>`;
    }
}

function displayMovies(movies) {
    MOVIE_GRID.innerHTML = '';
    if (movies.length === 0) {
        MOVIE_GRID.innerHTML = `<p class="text-light text-center w-100">No movies found matching your criteria.</p>`;
        return;
    }

    movies.forEach(movie => {
        const col = document.createElement('div');
        col.className = 'col';

        const card = document.createElement('div');
        card.className = 'card movie-card text-center';
        
        card.innerHTML = `
            <img src="${movie.img}" class="card-img-top movie-img" alt="${movie.title}">
            <div class="card-body p-1">
                <h6 class="movie-title">${movie.title}</h6>
            </div>
        `;

        const link = document.createElement('a');
        link.href = '/moviedesc.html';
        link.className = 'text-decoration-none text-light';

        link.addEventListener('click', (e) => {
            sessionStorage.setItem('selectedMovie', JSON.stringify(movie));
        });

        link.appendChild(card);
        col.appendChild(link);
        MOVIE_GRID.appendChild(col);
    });
}

// Populate genre filter
async function populateGenreFilter() {
    try {
        const response = await fetch(`${BASE_URL}/genres`);
        const genres = await response.json();
        
        genreIdToNameMap = genres.reduce((map, genre) => {
            map[genre.id] = genre.name;
            return map;
        }, {});

        const genreContainer = document.querySelector('.genre-checkboxes');
        genreContainer.innerHTML = genres.map(genre => `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${genre.id}" id="genre-${genre.id}">
                <label class="form-check-label" for="genre-${genre.id}">${genre.name}</label>
            </div>
        `).join('');
    } catch (error) {
        console.error("Failed to populate genres:", error);
    }
}

function updateActiveFiltersDisplay() {
    let filtersHtml = '';
    if (activeFilters.genres.length > 0) {
        const genreNames = activeFilters.genres.map(id => genreIdToNameMap[id] || id).join(', ');
        filtersHtml += `<span class="badge bg-secondary me-2">Genres: ${genreNames}</span>`;
    }
    if (activeFilters.yearRange) {
        filtersHtml += `<span class="badge bg-secondary me-2">Years: ${activeFilters.yearRange.start}-${activeFilters.yearRange.end}</span>`;
    }
    ACTIVE_FILTERS_DISPLAY.innerHTML = filtersHtml;
}

function updatePagination() {
    PAGE_INDICATOR.textContent = `Page ${currentPage}`;
    PREV_BTN.disabled = currentPage === 1;
    NEXT_BTN.disabled = currentPage >= totalPages;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    MOVIE_GRID = document.getElementById('movieGrid');
    PREV_BTN = document.getElementById('prevBtn');
    NEXT_BTN = document.getElementById('nextBtn');
    PAGE_INDICATOR = document.getElementById('pageIndicator');
    ACTIVE_FILTERS_DISPLAY = document.getElementById('activeFiltersDisplay');
    
    populateGenreFilter();
    fetchAndDisplayMovies();
    
    // Pagination event listeners
    PREV_BTN.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchAndDisplayMovies();
        }
    });

    NEXT_BTN.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchAndDisplayMovies();
        }
    });
});

// Filter Apply Buttons
document.getElementById('applyGenreFilter').addEventListener('click', () => {
    const checkedBoxes = document.querySelectorAll('.genre-checkboxes input:checked');
    activeFilters.genres = Array.from(checkedBoxes).map(cb => cb.value);
    currentPage = 1;
    fetchAndDisplayMovies();
    updateActiveFiltersDisplay();
});

document.getElementById('clearGenreFilter').addEventListener('click', () => {
    activeFilters.genres = [];
    document.querySelectorAll('.genre-checkboxes input:checked').forEach(cb => cb.checked = false);
    currentPage = 1;
    fetchAndDisplayMovies();
    updateActiveFiltersDisplay();
});

document.getElementById('applyYearFilter').addEventListener('click', () => {
    const startYear = document.getElementById('startYear').value;
    const endYear = document.getElementById('endYear').value;
    if (startYear && endYear && parseInt(startYear) <= parseInt(endYear)) {
        activeFilters.yearRange = { start: startYear, end: endYear };
        currentPage = 1;
        fetchAndDisplayMovies();
        updateActiveFiltersDisplay();
    } else if (startYear || endYear) {
        showCustomMessage("Please enter a valid start and end year.");
    }
});

document.getElementById('clearYearFilter').addEventListener('click', () => {
    activeFilters.yearRange = null;
    document.getElementById('startYear').value = '';
    document.getElementById('endYear').value = '';
    currentPage = 1;
    fetchAndDisplayMovies();
    updateActiveFiltersDisplay();
});

// Sort Dropdown
document.querySelectorAll('[data-sort]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        activeFilters.sort = item.dataset.sort;
        currentPage = 1;
        fetchAndDisplayMovies();
    });
});

function showCustomMessage(message, title = "Message") {
    // Set the modal title and body
    document.getElementById('customMessageModalBody').textContent = message;
  
    // Show the modal (Bootstrap 5)
    const modal = new bootstrap.Modal(document.getElementById('customMessageModal'));
    modal.show();
  }

