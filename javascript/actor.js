const BASE_URL = '/api/tmdb';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', async () => {
  const actor = JSON.parse(sessionStorage.getItem('selectedActor'));

  if (actor) {
    // Handle both image and profile_path properties
    const actorImage = actor.image || actor.profile_path || 'images/default-profile.webp';
    document.getElementById("actor-img").src = actorImage;
    document.getElementById("actor-img").alt = actor.name;
    document.getElementById("actor-name").textContent = actor.name;

    await fetchAndDisplayActorDetails(actor.id);
  } else {
    document.querySelector("body").innerHTML = "<h2 class='text-center mt-5 text-light'>Actor not found</h2>";
  }
});

async function fetchAndDisplayActorDetails(actorId) {
  try {
    const res = await fetch(`${BASE_URL}/actors/${actorId}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const actorDetails = await res.json();

    document.getElementById("actor-bio").textContent = actorDetails.biography || "Biography not available.";
    document.getElementById("actor-born").innerHTML = actorDetails.birthday
      ? `Born: ${actorDetails.birthday}`
      : "Birth date not available.";

    // Call to fetch and display filmography
    fetchAndDisplayFilmography(actorId);
  } catch (error) {
    console.error('Error fetching actor details:', error);
    document.getElementById("actor-bio").textContent = "Error loading actor biography.";
    document.getElementById("actor-born").innerHTML = "Error loading actor details.";
  }
}

async function fetchAndDisplayFilmography(actorId) {
  try {
    const res = await fetch(`${BASE_URL}/actors/${actorId}/movies`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();

    const filmList = document.getElementById("actor-films");
    
    // Add Bootstrap grid classes to container
    filmList.className = "row row-cols-1 row-cols-sm-2 row-cols-md-5 g-4 justify-content-center list-unstyled";
    filmList.innerHTML = "";

    if (!data.cast || data.cast.length === 0) {
      filmList.innerHTML = "<p class='text-light'>No filmography available.</p>";
      return;
    }

    data.cast.forEach(film => {
      const li = document.createElement("li");
      li.classList.add("movie-card", "col", "text-center");

      const movieLink = document.createElement("a");
      movieLink.classList.add("text-decoration-none");
      movieLink.href = '../html/moviedesc.html';

      movieLink.addEventListener('click', () => {
        const movieData = {
          id: film.id,
          title: film.title,
          img: film.poster_path
        };

        sessionStorage.setItem('selectedMovie', JSON.stringify(movieData));
      });

      const img = document.createElement("img");
      img.src = film.poster_path;
      img.alt = film.title;
      img.classList.add("movie-img");

      const title = document.createElement("div");
      title.textContent = film.title;
      title.classList.add("movie-title");

      movieLink.appendChild(img);
      movieLink.appendChild(title);
      li.appendChild(movieLink);
      filmList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching filmography:', error);
    const filmList = document.getElementById("actor-films");
    filmList.innerHTML = "<p class='text-light'>Error loading filmography.</p>";
  }
}
