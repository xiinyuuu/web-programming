console.log('Roulette.js loaded!');

// Load roulette.css if not already loaded
const cssHref = '/stylesheet/roulette.css';
const linkExists = [...document.styleSheets].some(s => s.href && s.href.includes('roulette.css'));

if (!linkExists) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssHref;
  document.head.appendChild(link);
  console.log('Roulette CSS loaded');
}

// API Configuration
const ROULETTE_BASE_URL = '/api/filter';
let allGenres = [];
let currentGenreMovies = [];
let currentGenreId = null;
let rouletteCurrentPage = 1;
let rouletteTotalPages = 1;

// Cache for storing movies by genre
let movieCache = {};
let popularMovies = [];
let currentMovieIndex = 0;
const MOVIES_PER_GENRE = 100; // Increased from 50 to 100 movies per genre
const POPULAR_MOVIES_COUNT = 100; // Cache 100 popular movies

// Track the last set of displayed movie IDs to avoid repeats between shuffles
let lastRouletteMovieIds = [];

// Create modal HTML directly
function createRouletteModal() {
  const container = document.getElementById('roulette-modal-container');
  if (!container) {
    console.error('roulette-modal-container not found!');
    return;
  }

  container.innerHTML = `
    <div class="modal fade" id="rouletteModal" tabindex="-1" aria-labelledby="rouletteModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content p-1">
          <div class="modal-header">
            <h5 class="modal-title" id="rouletteModalLabel">Don't know what to watch? Just Spin the Wheel!</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-0 text-end">
              <div class="dropdown d-inline-block">
                <button class="btn btn-outline-light dropdown-toggle" type="button" id="genreDropdownButton" data-bs-toggle="dropdown" aria-expanded="false">
                  Pick A Genre!
                </button>
                <ul class="dropdown-menu" aria-labelledby="genreDropdownButton">
                  <!-- Genres will be populated dynamically by JavaScript -->
                </ul>
              </div>
            </div>
            <div class="roulette-wrapper">
              <div class="container">
                <div class="spinBtn">Spin!</div>
                <div class="wheel">
                  <div class="number" style="--i:1;--clr:#db7093;"><span></span></div>
                  <div class="number" style="--i:2;--clr:#20b22a;"><span></span></div>
                  <div class="number" style="--i:3;--clr:#d63e92;"><span></span></div>
                  <div class="number" style="--i:4;--clr:#daa520;"><span></span></div>
                  <div class="number" style="--i:5;--clr:#ff340f;"><span></span></div>
                  <div class="number" style="--i:6;--clr:#ff7f50;"><span></span></div>
                  <div class="number" style="--i:7;--clr:#3cb371;"><span></span></div>
                  <div class="number" style="--i:8;--clr:#4169e1;"><span></span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer" style="display: none;">
            <button type="button" class="shuffleBtn btn" 
            style="color: white; background-color: #000000; border-color: #c8a300;"
            onmouseover="this.style.backgroundColor='#c8a300'; this.style.borderColor='#c8a300';"
            onmouseout="this.style.backgroundColor='#000000'; this.style.borderColor='#c8a300';">
            <i class="bi bi-shuffle me-2"></i>Shuffle</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="resultModal" tabindex="-1" aria-labelledby="resultModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-1">
          <div class="modal-header border-0 text-center">
            <h5 class="modal-title" id="resultModalLabel" style="color:rgb(203, 203, 33); font-weight: bold;">Your Pick! Enjoy Watching! 🤩</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <img id="resultPoster" src="" alt="Movie Poster" class="img-fluid rounded mb-3" style="max-height: 300px;">
            <h4 id="resultTitle" style="font-weight: bold;"></h4>
            <p id="resultDuration" style="color: darkgrey;"></p>
            <p id="resultInfo" style="color: darkgrey;"></p>
          </div>
        </div>
      </div>
    </div>
  `;

  console.log('Roulette modal HTML created successfully');

  // Attach event listeners
    const resultModalEl = document.getElementById("resultModal");
    // const rouletteDimOverlay = document.getElementById("rouletteDimOverlay");
    let rouletteDimOverlay = document.getElementById('rouletteDimOverlay');
  if (!rouletteDimOverlay) {
    rouletteDimOverlay = document.createElement('div');
    rouletteDimOverlay.id = 'rouletteDimOverlay';
    rouletteDimOverlay.className = 'roulette-dim-overlay';
    rouletteDimOverlay.style.display = 'none';
    document.body.appendChild(rouletteDimOverlay);
  }
  const modalFooter = document.querySelector('#rouletteModal .modal-footer');

  if (!resultModalEl) {
    console.error('resultModal not found!');
  }

    resultModalEl.addEventListener("shown.bs.modal", () => {
      console.log("Result modal shown, overlay:", rouletteDimOverlay);
      if (rouletteDimOverlay) rouletteDimOverlay.style.display = "block";
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    });

    resultModalEl.addEventListener("hidden.bs.modal", () => {
      console.log("Result modal hidden, overlay:", rouletteDimOverlay);
      if (rouletteDimOverlay) rouletteDimOverlay.style.display = "none";
      });

  // Reset modal title when modal is opened
  const rouletteModal = document.getElementById('rouletteModal');
  if (rouletteModal) {
    rouletteModal.addEventListener('show.bs.modal', () => {
      const modalTitle = document.getElementById('rouletteModalLabel');
      if (modalTitle) {
        modalTitle.textContent = 'Don\'t know what to watch? Just Spin the Wheel!';
      }
    });
  }

  // Initialize the roulette
  initializeRoulette();

  // Test roulette button
  setTimeout(() => {
    const rouletteButton = document.querySelector('.roulette-button');
    if (rouletteButton) {
      console.log('Roulette button found and ready!');
      rouletteButton.addEventListener('click', () => {
        console.log('Roulette button clicked!');
      });
    } else {
      console.log('Roulette button not found after modal creation');
    }
  }, 500);

  // Ensure the overlay is present in the body (not just inside the modal)
  if (!document.getElementById('rouletteDimOverlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'rouletteDimOverlay';
    overlay.className = 'roulette-dim-overlay';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createRouletteModal);
} else {
  createRouletteModal();
}

// Initialize the roulette functionality
async function initializeRoulette() {
  try {
    console.log('Initializing roulette...');
    
    // Fetch genres first
    console.log('Fetching genres...');
    await fetchGenres();
    
    // Pre-fetch popular movies for initial wheel
    console.log('Pre-fetching popular movies...');
    await preFetchPopularMovies();
    
    // Set up event listeners
    console.log('Setting up event listeners...');
    setupEventListeners();
    
    // Initialize wheel with cached popular movies
    console.log('Loading cached popular movies...');
    loadCachedPopularMovies();
    
    // Update cache status
    updateCacheStatus();
    
    // Pre-fetch movies for all genres in the background
    console.log('Starting background pre-fetch for all genres...');
    preFetchAllGenresInBackground();
    
    console.log('Roulette initialization complete!');
  } catch (error) {
    console.error('Failed to initialize roulette:', error);
  }
}

// Fetch all available genres from the API
async function fetchGenres() {
  try {
    // Show loading state in dropdown
    const dropdownMenu = document.querySelector('#rouletteModal .dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.innerHTML = '<li><div class="dropdown-item text-center"><div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div> Loading genres...</div></li>';
    }

    const response = await fetch(`${ROULETTE_BASE_URL}/genres`);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    
    allGenres = await response.json();
    
    // Populate the genre dropdown
    populateGenreDropdown();
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    // Fallback to some basic genres if API fails
    allGenres = [
      { id: 28, name: 'Action' },
      { id: 35, name: 'Comedy' },
      { id: 18, name: 'Drama' },
      { id: 27, name: 'Horror' },
      { id: 10749, name: 'Romance' },
      { id: 878, name: 'Sci-Fi' },
      { id: 53, name: 'Thriller' }
    ];
    populateGenreDropdown();
  }
}

// Populate the genre dropdown with fetched genres
function populateGenreDropdown() {
  const dropdownMenu = document.querySelector('#rouletteModal .dropdown-menu');
  if (!dropdownMenu) return;

  dropdownMenu.innerHTML = allGenres.map(genre => 
    `<li><a class="dropdown-item" href="#" onclick="selectGenre(${genre.id}, '${genre.name}')">${genre.name}</a></li>`
  ).join('');
}

// Pre-fetch popular movies for initial wheel
async function preFetchPopularMovies() {
  try {
    const response = await fetch(`${ROULETTE_BASE_URL}/movies?page=1&sort=popularity.desc&include_adult=false`);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    
    const data = await response.json();
    popularMovies = data.results.slice(0, POPULAR_MOVIES_COUNT);
    console.log(`Cached ${popularMovies.length} popular movies (excluding adult content)`);
  } catch (error) {
    console.error('Failed to pre-fetch popular movies:', error);
    popularMovies = [];
  }
}

// Pre-fetch movies for a specific genre
async function preFetchGenreMovies(genreId, genreName) {
  if (movieCache[genreId]) {
    console.log(`Using cached movies for ${genreName} (${movieCache[genreId].length} movies)`);
    return movieCache[genreId];
  }

  try {
    console.log(`Pre-fetching movies for ${genreName} (ID: ${genreId})...`);
    
    // Fetch just one page initially for faster loading, excluding adult content
    const response = await fetch(`${ROULETTE_BASE_URL}/movies?page=1&genres=${genreId}&sort=popularity.desc&include_adult=false`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Page 1 returned ${data.results.length} movies for ${genreName} (excluding adult content)`);
    
    // Cache the movies (limit to MOVIES_PER_GENRE)
    movieCache[genreId] = data.results.slice(0, MOVIES_PER_GENRE);
    console.log(`Successfully cached ${movieCache[genreId].length} movies for ${genreName}`);
    
    return movieCache[genreId];
  } catch (error) {
    console.error(`Failed to pre-fetch movies for ${genreName}:`, error);
    // Return empty array but don't cache the error
    return [];
  }
}

// Load cached popular movies to wheel
function loadCachedPopularMovies() {
  if (popularMovies.length === 0) {
    const wheel = document.querySelector('.wheel');
    if (wheel) {
      wheel.innerHTML = '<div class="text-center text-light"><p>No movies available. Please try again.</p></div>';
    }
    return;
  }
  
  // Shuffle and take first 8 movies
  const shuffledMovies = shuffleArray(popularMovies).slice(0, 8);
  updateWheelWithMovies(shuffledMovies);
}

    // Update dropdown button text when a genre is selected
window.selectGenre = async function(genreId, genreName) {
  try {
      const btn = document.getElementById('genreDropdownButton');
    if (btn) btn.textContent = genreName;

      // Show the modal footer when a genre is selected
    const modalFooter = document.querySelector('#rouletteModal .modal-footer');
      if (modalFooter) {
        modalFooter.style.display = '';
      }

    // Show loading state
    const wheel = document.querySelector('.wheel');
    if (wheel) {
      wheel.innerHTML = `<div class="text-center text-light"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading ${genreName} movies...</p></div>`;
    }

    currentGenreId = genreId;

    // Get or pre-fetch movies for this genre with timeout
    console.log(`Starting to load movies for ${genreName}...`);
    const genreMovies = await Promise.race([
      preFetchGenreMovies(genreId, genreName),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: Loading took too long')), 10000)
      )
    ]);
    
    currentGenreMovies = genreMovies;
    console.log(`Set currentGenreMovies to ${genreMovies.length} movies for ${genreName}`);
    console.log('Current genre movies titles:', genreMovies.map(m => m.title));

    // Update the wheel with random movies from cache
    updateWheelWithRandomMovies(genreMovies);

    // Show total movies available
    if (genreMovies.length > 0) {
      const modalTitle = document.getElementById('rouletteModalLabel');
      if (modalTitle) {
        modalTitle.textContent = 'Don\'t know what to watch? Just Spin the Wheel!';
      }
    } else {
      // Fallback to popular movies if genre loading failed
      console.log(`No movies for ${genreName}, falling back to popular movies`);
      updateWheelWithRandomMovies(popularMovies);
      
      const modalTitle = document.getElementById('rouletteModalLabel');
      if (modalTitle) {
        modalTitle.textContent = 'Don\'t know what to watch? Just Spin the Wheel!';
      }
    }
  } catch (error) {
    console.error('Failed to select genre:', error);
    // Show error state
    const wheel = document.querySelector('.wheel');
    if (wheel) {
      wheel.innerHTML = `<div class="text-center text-light"><p>Failed to load movies for ${genreName}. Please try again.</p><small>Error: ${error.message}</small></div>`;
    }
  }
};

// Get random movies from cache for wheel
function updateWheelWithRandomMovies(movies) {
  console.log('updateWheelWithRandomMovies called with', movies.length, 'movies');

  if (movies.length === 0) {
    console.log('No movies provided, showing error message');
    const wheel = document.querySelector('.wheel');
    if (wheel) {
      wheel.innerHTML = '<div class="text-center text-light"><p>No movies available for this genre.</p></div>';
    }
    return;
  }

  // Exclude last shown movies if possible
  let availableMovies = movies.filter(m => !lastRouletteMovieIds.includes(m.id));
  let nextMovies = [];
  if (availableMovies.length >= 8) {
    nextMovies = shuffleArray(availableMovies).slice(0, 8);
  } else {
    // Not enough unique movies, allow repeats to fill
    nextMovies = shuffleArray(movies).slice(0, 8);
  }
  // Update the tracker for next shuffle
  lastRouletteMovieIds = nextMovies.map(m => m.id);
  console.log('Shuffled movies (no repeats from last set):', nextMovies.map(m => m.title));
  updateWheelWithMovies(nextMovies);
}

// Update the wheel segments with movie data
function updateWheelWithMovies(movies) {
  console.log('updateWheelWithMovies called with', movies.length, 'movies');
  console.log('Movies being displayed on wheel:', movies.map(m => m.title));
  
  const wheel = document.querySelector('.wheel');
  if (!wheel) {
    console.error('Wheel element not found!');
    return;
  }
  
  // Check if wheel has been replaced with loading spinner
  if (wheel.innerHTML.includes('spinner-border')) {
    console.log('Wheel was replaced with loading spinner, recreating wheel structure');
    // Recreate the wheel structure
    wheel.innerHTML = `
      <div class="number" style="--i:1;--clr:#db7093;"><span></span></div>
      <div class="number" style="--i:2;--clr:#20b22a;"><span></span></div>
      <div class="number" style="--i:3;--clr:#d63e92;"><span></span></div>
      <div class="number" style="--i:4;--clr:#daa520;"><span></span></div>
      <div class="number" style="--i:5;--clr:#ff340f;"><span></span></div>
      <div class="number" style="--i:6;--clr:#ff7f50;"><span></span></div>
      <div class="number" style="--i:7;--clr:#3cb371;"><span></span></div>
      <div class="number" style="--i:8;--clr:#4169e1;"><span></span></div>
    `;
  }
  
  const segments = document.querySelectorAll('.wheel .number');
  console.log('Found', segments.length, 'wheel segments');
  
  // Store the movies being displayed on the wheel for later reference
  window.wheelMovies = movies;
  
      segments.forEach((segment, index) => {
        const spanElement = segment.querySelector('span');
    if (spanElement && movies[index]) {
      spanElement.textContent = movies[index].title;
          segment.style.display = '';
          segment.style.setProperty('--clr', generateRandomColor());
      console.log(`Updated segment ${index} with: ${movies[index].title}`);
        } else if (segment) {
          segment.style.display = 'none';
      console.log(`Hiding segment ${index}`);
        }
      });
    }

// Shuffle movies and update wheel
async function shuffleMoviesAndUpdateWheel() {
  if (!currentGenreId) return;

  // Show loading state
  const wheel = document.querySelector('.wheel');
  if (wheel) {
    wheel.innerHTML = '<div class="text-center text-light"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Shuffling movies...</p></div>';
  }

  // Get cached movies for current genre
  const genreName = allGenres.find(g => g.id === currentGenreId)?.name || 'Unknown';
  const genreMovies = await preFetchGenreMovies(currentGenreId, genreName);

  // Exclude last shown movies if possible
  let availableMovies = genreMovies.filter(m => !lastRouletteMovieIds.includes(m.id));
  let nextMovies = [];
  if (availableMovies.length >= 8) {
    nextMovies = shuffleArray(availableMovies).slice(0, 8);
  } else {
    // Not enough unique movies, allow repeats to fill
    nextMovies = shuffleArray(genreMovies).slice(0, 8);
  }
  // Update the tracker for next shuffle
  lastRouletteMovieIds = nextMovies.map(m => m.id);
  updateWheelWithMovies(nextMovies);
}

// Utility function to shuffle an array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate random color for wheel segments
function generateRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
}

// Setup event listeners for wheel and buttons
function setupEventListeners() {
  const wheel = document.querySelector('.wheel');
  const spinBtn = document.querySelector('.spinBtn');
  const shuffleBtn = document.querySelector('.shuffleBtn');
  const segments = document.querySelectorAll('.wheel .number');
  const segmentCount = segments.length;

  if (!wheel || !spinBtn) return;

  let currentRotation = 0;

  // Spin button click handler
    spinBtn.onclick = function () {
      console.log('Spin button clicked!');
      console.log('Current genre movies:', currentGenreMovies.length);
      console.log('Popular movies:', popularMovies.length);
      
      const spinDegrees = Math.ceil(Math.random() * 3600);
      currentRotation += spinDegrees;

      wheel.style.transform = `rotate(${currentRotation}deg)`;

      const segmentAngle = 360 / segmentCount;
      const normalizedRotation = currentRotation % 360;
      const winningIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) % 360 / segmentAngle);
    
      const winningSegment = segments[winningIndex];
      if (!winningSegment || winningSegment.style.display === 'none') {
        console.log('Winning segment not found or hidden');
        return;
      }
    
      const winningMovieTitle = winningSegment.querySelector('span').textContent;
      console.log('Winning movie title:', winningMovieTitle);
      console.log('Winning movie title length:', winningMovieTitle.length);
      console.log('Winning movie title char codes:', Array.from(winningMovieTitle).map(c => c.charCodeAt(0)));
      
      // Use the movies that are actually displayed on the wheel
      const availableMovies = window.wheelMovies || (currentGenreMovies.length > 0 ? currentGenreMovies : popularMovies);
      
      // Try exact match first
      let winningMovie = availableMovies.find(movie => movie.title === winningMovieTitle);
      
      // If exact match fails, try trimmed match
      if (!winningMovie) {
        console.log('Exact match failed, trying trimmed match...');
        const trimmedTitle = winningMovieTitle.trim();
        winningMovie = availableMovies.find(movie => movie.title.trim() === trimmedTitle);
      }
      
      // If still no match, try case-insensitive match
      if (!winningMovie) {
        console.log('Trimmed match failed, trying case-insensitive match...');
        winningMovie = availableMovies.find(movie => 
          movie.title.toLowerCase().trim() === winningMovieTitle.toLowerCase().trim()
        );
      }
      
      // If still no match, try partial match
      if (!winningMovie) {
        console.log('Case-insensitive match failed, trying partial match...');
        winningMovie = availableMovies.find(movie => 
          movie.title.toLowerCase().includes(winningMovieTitle.toLowerCase().trim()) ||
          winningMovieTitle.toLowerCase().trim().includes(movie.title.toLowerCase())
        );
      }
      
      // If still no match, use the winning index as fallback
      if (!winningMovie && availableMovies.length > 0) {
        console.log('All matching attempts failed, using winning index as fallback...');
        const fallbackIndex = winningIndex % availableMovies.length;
        winningMovie = availableMovies[fallbackIndex];
        console.log(`Using fallback movie at index ${fallbackIndex}: ${winningMovie.title}`);
      }
      
      console.log('Available movies count:', availableMovies.length);
      console.log('Available movies titles:', availableMovies.map(m => m.title));
      console.log('Winning movie found:', winningMovie ? winningMovie.title : 'Not found');

      setTimeout(async () => {
        if (winningMovie) {
          console.log('Showing result modal for:', winningMovie.title);
          document.getElementById("resultPoster").src = winningMovie.img;
          document.getElementById("resultTitle").textContent = winningMovie.title;

          // Fetch additional details for duration, genre, year
          let durationText = '';
          let genreText = '';
          let yearText = '';
          try {
            const res = await fetch(`/api/tmdb/movies/${winningMovie.id}`);
            if (res.ok) {
              const details = await res.json();
              // Format duration as '1h 53m'
              if (details.runtime && !isNaN(details.runtime)) {
                const hours = Math.floor(details.runtime / 60);
                const minutes = details.runtime % 60;
                durationText = `${hours > 0 ? hours + 'h ' : ''}${minutes}m`;
              } else {
                durationText = 'N/A';
              }
              // Format genres as 'Sci-Fi, Action'
              if (details.genres && details.genres.length > 0) {
                genreText = details.genres.map(g => g.name).join(', ');
              } else {
                genreText = 'N/A';
              }
              // Year
              yearText = details.release_date ? details.release_date.split('-')[0] : 'N/A';
            } else {
              durationText = 'N/A';
              genreText = 'N/A';
              yearText = winningMovie.release_date ? winningMovie.release_date.split('-')[0] : 'N/A';
            }
          } catch (err) {
            durationText = 'N/A';
            genreText = 'N/A';
            yearText = winningMovie.release_date ? winningMovie.release_date.split('-')[0] : 'N/A';
          }

          // Set modal info in the requested format
          document.getElementById("resultDuration").textContent = durationText;
          document.getElementById("resultInfo").textContent = `${genreText} • ${yearText}`;

          // Add click handler to navigate to movie details
          const resultModalBody = document.querySelector('#resultModal .modal-body');
          if (resultModalBody) {
            resultModalBody.style.cursor = 'pointer';
            resultModalBody.style.transition = 'transform 0.2s ease';
            resultModalBody.onmouseenter = () => {
              resultModalBody.style.transform = 'scale(1.02)';
            };
            resultModalBody.onmouseleave = () => {
              resultModalBody.style.transform = 'scale(1)';
            };
            resultModalBody.onclick = () => {
              sessionStorage.setItem('selectedMovie', JSON.stringify(winningMovie));
              bootstrap.Modal.getInstance(document.getElementById("resultModal")).hide();
              window.location.href = '/moviedesc.html';
            };
          }

              const resultModal = new bootstrap.Modal(document.getElementById("resultModal"));
              resultModal.show();
        } else {
          console.error('Winning movie not found in available movies');
          }
      }, 5100); // Wait until the spin animation ends
    };

  // Shuffle button click handler
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', shuffleMoviesAndUpdateWheel);
    }
}

// Show cache status in modal title
function updateCacheStatus() {
  // Removed cache status display to keep modal title clean
  return;
}

// Pre-fetch movies for all genres in the background
async function preFetchAllGenresInBackground() {
  // Use setTimeout to not block the UI
  setTimeout(async () => {
    for (const genre of allGenres) {
      try {
        await preFetchGenreMovies(genre.id, genre.name);
        // Update cache status after each genre is cached
        updateCacheStatus();
        // Small delay between requests to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Background pre-fetch failed for ${genre.name}:`, error);
      }
    }
    console.log('Background pre-fetch complete!');
    updateCacheStatus();
  }, 1000); // Start after 1 second
}

  