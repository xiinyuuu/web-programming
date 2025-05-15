const API_KEY = 'b855267d7a05ecc45792618a1e73a27b';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', async () => {
  const actor = JSON.parse(sessionStorage.getItem('selectedActor'));

  if (actor) {
    document.getElementById("actor-img").src = actor.image;
    document.getElementById("actor-img").alt = actor.name;
    document.getElementById("actor-name").textContent = actor.name;

    await fetchAndDisplayActorDetails(actor.id);
  } else {
    document.querySelector("body").innerHTML = "<h2 class='text-center mt-5 text-light'>Actor not found</h2>";
  }
});

async function fetchAndDisplayActorDetails(actorId) {
  try {
    const res = await fetch(`${BASE_URL}/person/${actorId}?api_key=${API_KEY}&language=en-US`);
    const actorDetails = await res.json();

    document.getElementById("actor-bio").textContent = actorDetails.biography || "Biography not available.";
    document.getElementById("actor-born").innerHTML = actorDetails.birthday
      ? `Born: ${actorDetails.birthday}`
      : "Birth date not available.";

    // Call to fetch and display filmography
    fetchAndDisplayFilmography(actorId);
  } catch (error) {
    console.error('Error fetching actor details:', error);
  }
}

async function fetchAndDisplayFilmography(actorId) {
  try {
    const res = await fetch(`${BASE_URL}/person/${actorId}/movie_credits?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();

    const filmList = document.getElementById("actor-films");
    filmList.innerHTML = "";

    const knownMovies = data.cast
      .filter(movie => movie.poster_path) // only include movies with posters
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0)) // sort by popularity
      .slice(0, 10); // limit to top 10

    knownMovies.forEach(film => {
      const li = document.createElement("li");
      li.classList.add("movie-card", "d-inline-block", "me-3", "text-center");

      const movieLink = document.createElement("a");
      movieLink.classList.add("text-decoration-none");
      movieLink.href = '../html/moviedesc.html';

      movieLink.addEventListener('click', () => {
        const movieData = {
          id: film.id,
          title: film.title,
          img: `${IMAGE_BASE}${film.poster_path}` // now it matches what moviedesc.html expects
        };

        sessionStorage.setItem('selectedMovie', JSON.stringify(movieData));
      });

      const img = document.createElement("img");
      img.src = `${IMAGE_BASE}${film.poster_path}`;
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

    if (knownMovies.length === 0) {
      filmList.innerHTML = "<p class='text-light'>No filmography available.</p>";
    }
  } catch (error) {
    console.error('Error fetching filmography:', error);
  }
}
