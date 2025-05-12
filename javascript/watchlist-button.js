// Run this after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
    // Find the "Add to Watchlist" button on the page
    const watchlistBtn = document.getElementById('watchlistBtn');
  
    // Make sure the button exists before adding functionality
    if (watchlistBtn) {
      // When the user clicks the button
      watchlistBtn.addEventListener('click', () => {
        // Change the button text to show it's been added
        watchlistBtn.textContent = 'Added to Watchlist';
  
        // Add the 'active' class so the button style changes
        watchlistBtn.classList.add('active');
  
        // Disable the button to prevent further clicks
        watchlistBtn.disabled = true;
      });
    }
  });
  