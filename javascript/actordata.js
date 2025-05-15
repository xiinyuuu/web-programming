const API_KEY = 'b855267d7a05ecc45792618a1e73a27b';
const BASE_URL = 'https://api.themoviedb.org/3';
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
      const res = await fetch(`${BASE_URL}/person/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
      const data = await res.json();
      if (!data.results) continue;

      for (const person of data.results) {
        if (actorIds.has(person.id)) continue;
        actorIds.add(person.id);

        actors.push({
          id: person.id,
          name: person.name || "Unknown",
          image: person.profile_path ? `${IMAGE_BASE}${person.profile_path}` : "images/default-profile.webp"
        });
      }

    } catch (error) {
      console.warn("Error fetching actors:", error);
    }
  }
}

    

