document.addEventListener("DOMContentLoaded", async function () {
  const userId = localStorage.getItem("userId");
  const container = document.querySelector(".row-cols-1.row-cols-sm-2.row-cols-md-5");

  if (!userId || !container) {
    console.warn("User not logged in or container not found.");
    return;
  }

  let movieIdToRemove = null;

  // Load Watchlist
  try {
    const res = await fetch(`/api/watchlist/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch watchlist");
    const watchlist = await res.json();

    container.innerHTML = "";

    if (watchlist.length === 0) {
      container.innerHTML = `<p class="text-light text-center">Your watchlist is empty.</p>`;
      return;
    }

    watchlist.forEach(movie => {
      const col = document.createElement("div");
      col.className = "col";
      col.dataset.movieId = movie.movieId; // store actual ID for accurate removal/toggle

      // Create the card
      const card = document.createElement('div');
      card.className = 'card movie-card text-center';

      // Create clickable poster
      const posterLink = document.createElement('a');
      posterLink.href = '/moviedesc.html';
      posterLink.addEventListener('click', (e) => {
        sessionStorage.setItem('selectedMovie', JSON.stringify({
          id: movie.movieId,
          title: movie.title,
          img: movie.poster
        }));
      });
      posterLink.innerHTML = `<img src="${movie.poster}" class="card-img-top movie-img" alt="${movie.title}">`;

      // Card body
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body p-2';
      cardBody.innerHTML = `
            <h6 class="movie-title">${movie.title}</h6>
            <button class="btn ${movie.watched ? 'btn-success' : 'btn-outline-success'} btn-sm mt-2 toggle-watched">
              ${movie.watched ? 'Watched' : 'Mark as Watched'}
            </button>
            <button class="btn btn-danger btn-sm mt-2" data-bs-toggle="modal" data-bs-target="#removeModal"
              data-movie-title="${movie.title}" data-movie-id="${movie.movieId}">
              Remove
            </button>
      `;

      // Assemble card
      card.appendChild(posterLink);
      card.appendChild(cardBody);
      col.appendChild(card);
      container.appendChild(col);
    });
  } catch (err) {
    console.error("❌ Failed to load watchlist:", err);
    container.innerHTML = `<p class="text-danger">Failed to load watchlist. Please try again later.</p>`;
  }

  // Handle Remove Modal Setup
  const removePopup = document.getElementById("removeModal");
  removePopup.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const movieTitle = button.getAttribute("data-movie-title");
    movieIdToRemove = button.getAttribute("data-movie-id");

    document.getElementById("movieToRemove").textContent = `"${movieTitle}"`;
  });

  // Confirm Remove
  document.getElementById("confirmRemove").addEventListener("click", async function () {
    if (!movieIdToRemove) return;

    try {
      const res = await fetch(`/api/watchlist/${userId}/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movieIdToRemove }),
      });

      if (!res.ok) throw new Error("Failed to remove");

      // Remove from DOM
      const cardToRemove = [...container.children].find(col => col.dataset.movieId === movieIdToRemove);
      if (cardToRemove) cardToRemove.remove();
    } catch (err) {
      console.error("❌ Error removing movie:", err);
      showCustomMessage("Failed to remove the movie. Please try again.");
    }
  });

  // Handle Watched Toggle
  container.addEventListener("click", async function (e) {
    if (e.target.classList.contains("toggle-watched")) {
      const button = e.target;
      const card = button.closest(".col");
      const movieId = card.dataset.movieId;

      try {
        const res = await fetch(`/api/watchlist/${userId}/toggle`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to toggle status");

        button.textContent = data.watched ? "Watched" : "Mark as Watched";
        button.classList.toggle("btn-success", data.watched);
        button.classList.toggle("btn-outline-success", !data.watched);
      } catch (err) {
        console.error("❌ Failed to toggle watched status:", err);
        showCustomMessage("Could not update watched status.");
      }
    }
  });
});
function showCustomMessage(message, title = "Message") {
  // Set the modal title and body
  document.getElementById('customMessageModalBody').textContent = message;

  // Show the modal (Bootstrap 5)
  const modal = new bootstrap.Modal(document.getElementById('customMessageModal'));
  modal.show();
}
