// Wait until the whole page is fully loaded before running anything
document.addEventListener("DOMContentLoaded", function () {
    // This will store the ID of the movie that the user wants to remove
    let movieToRemoveId = null;
  
    // Get the popup box that appears when clicking the "Remove" button
    const removePopup = document.getElementById('removeModal');
  
    // When the popup is about to appear (after clicking the "Remove" button)
    removePopup.addEventListener('show.bs.modal', function (event) {
      // The button that triggered this popup
      const button = event.relatedTarget;
  
      // Get the movie title from the button's data-movie attribute
      const movie = button.getAttribute('data-movie');
  
      // Display the movie title in the popup box message
      document.getElementById('movieToRemove').textContent = `"${movie}"`;
  
      // Create an ID based on the movie name to find the movie card later
      // For example: "Mulan" becomes "mulan-card"
      const movieId = movie.toLowerCase().replace(/\s+/g, '-') + '-card';
      movieToRemoveId = movieId;
    });
  
    // When user clicks "Yes, Remove" inside the popup box
    document.getElementById('confirmRemove').addEventListener('click', function () {
      // If there's a movie ID stored
      if (movieToRemoveId) {
        // Find the movie card in the page
        const movieElement = document.getElementById(movieToRemoveId);
  
        // If it exists, hide it (simulate removing)
        if (movieElement) {
          movieElement.style.display = 'none';
        }
      }
    });
  
    // Find all the "Mark as Watched" buttons
    document.querySelectorAll('.toggle-watched').forEach(button => {
      button.addEventListener('click', () => {
        // Check if it's already marked as watched
        const watched = button.classList.contains('btn-success');
  
        // Change the text depending on current state
        button.textContent = watched ? 'Mark as Watched' : 'Watched';
  
        // Change the button color (for Bootstrap buttons)
        button.classList.toggle('btn-outline-success');
        button.classList.toggle('btn-success');
      });
    });
  });
  