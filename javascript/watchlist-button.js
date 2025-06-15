document.addEventListener("DOMContentLoaded", function () {
  const watchlistBtn = document.getElementById("add-to-watchlist-btn");

  if (!watchlistBtn) return;

  // Always attach the click handler, even if userId or data attributes are not set yet
  watchlistBtn.addEventListener("click", async () => {
    const userId = localStorage.getItem("userId");
    const movieId = watchlistBtn.dataset.movieId;
    const title = watchlistBtn.dataset.title;
    const poster = watchlistBtn.dataset.poster;

    if (!userId) {
      alert("You must be logged in to add to your watchlist.");
      return;
    }
    if (!movieId || !title) {
      alert("Movie details are missing. Please try again later.");
      return;
    }
    if (watchlistBtn.disabled) return;

    try {
      const response = await fetch(`/api/watchlist/${userId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, title, poster }),
      });

      const data = await response.json();

      if (response.ok) {
        updateButtonUI(true);
        console.log("✅ Movie added to watchlist:", data.message);
      } else {
        alert(data.message || "Could not add movie.");
      }
    } catch (err) {
      console.error("❌ Error adding movie to watchlist:", err);
      alert("An error occurred while adding the movie.");
    }
  });

  // Check if already in watchlist (after data attributes are set)
  const checkAndUpdateButton = async () => {
    const userId = localStorage.getItem("userId");
    const movieId = watchlistBtn.dataset.movieId;
    if (!userId || !movieId) return;
    try {
      const res = await fetch(`/api/watchlist/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch watchlist");
      const watchlist = await res.json();
      const alreadyExists = watchlist.some(movie => movie.movieId === movieId);
      if (alreadyExists) {
        updateButtonUI(true);
      }
    } catch (err) {
      console.warn("⚠️ Could not check watchlist:", err.message);
    }
  };

  // Run check after a short delay to allow movie.js to set data attributes
  setTimeout(checkAndUpdateButton, 300);

  function updateButtonUI(added) {
    if (added) {
      watchlistBtn.textContent = "Added to Watchlist";
      watchlistBtn.classList.add("active");
      watchlistBtn.disabled = true;
    }
  }
});
