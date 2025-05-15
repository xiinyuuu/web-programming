const API_KEY = "b855267d7a05ecc45792618a1e73a27b";
const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("query")?.toLowerCase().trim() || "";

const resultsContainer = document.getElementById("results");
const resultCount = document.getElementById("result-count");
let count = 0;

async function searchTMDB(query) {
  const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results || [];
}

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
