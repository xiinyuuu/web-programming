const urlParams = new URLSearchParams(window.location.search);
const actorKey = urlParams.get("actor");
const actor = actors[actorKey];


if (actor) {
  document.getElementById("actor-img").src = actor.image;
  document.getElementById("actor-img").alt = actor.name;
  document.getElementById("actor-name").textContent = actor.name;
  document.getElementById("actor-bio").textContent = actor.bio;

 
  document.getElementById("actor-born").innerHTML = actor.born;

  const filmList = document.getElementById("actor-films");

  actor.filmography.forEach(film => {
    const li = document.createElement("li");
    li.classList.add("movie-card", "d-inline-block", "me-3", "text-center");

    // Create an anchor link for the movie
    const movieLink = document.createElement("a");
    movieLink.href = `../html/moviedesc.html?title=${encodeURIComponent(film.title)}`;
    movieLink.classList.add("text-decoration-none"); // Optional: remove underline
    console.log(movieLink.href); // This will log the href URL

    const img = document.createElement("img");
    img.src = film.poster;
    img.alt = film.title;
    img.classList.add("movie-img");

    const title = document.createElement("div");
    title.textContent = film.title;
    title.classList.add("movie-title");

   // Append img and title into anchor tag
    movieLink.appendChild(img);
    movieLink.appendChild(title);

    // Append anchor into list item
    li.appendChild(movieLink);
    filmList.appendChild(li);
  });
} else {
  document.querySelector("body").innerHTML = "<h2 class='text-center mt-5 text-light'>Actor not found</h2>";
}