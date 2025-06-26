// Remove the DOMContentLoaded wrapper and create a function that can be called after movie.js completes
function initializeReviews() {
  let reviewSelectedRating = 0;
  const reviewStars = document.querySelectorAll('#review-star-rating i');
  const reviewContainer = document.getElementById('review-user-reviews');
  const reviewSeeMoreBtn = document.getElementById('review-see-more-btn');
  const movieData = JSON.parse(sessionStorage.getItem('selectedMovie'));

  let reviewList = [];
  const REVIEWS_TO_SHOW = 5;
  let reviewCurrentDisplayed = 0;
  let expanded = false;

  // Track edit state
  let editingReviewId = null;
  let originalButtonText = null;

  // Generate stars HTML helper function
  function generateStarsHTML(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars += '<i class="bi bi-star-fill text-warning"></i>';
      } else if (i === Math.floor(rating) + 1 && rating % 1 >= 0.5) {
        // Use Bootstrap's half-star icon
        stars += '<i class="bi bi-star-half text-warning"></i>';
      } else {
        stars += '<i class="bi bi-star text-warning"></i>';
      }
    }
    return stars;
  }

  // Handle star selection
  reviewStars.forEach(star => {
    star.addEventListener('click', function () {
      reviewSelectedRating = parseInt(this.getAttribute('data-value'));
      updateReviewStars(reviewSelectedRating);
    });
  });

  function updateReviewStars(rating) {
    reviewStars.forEach(star => {
      const val = parseInt(star.getAttribute('data-value'));
      star.className = val <= rating ? "bi bi-star-fill text-warning" : "bi bi-star text-warning";
    });
  }

  function getCurrentUser() {
    const userData = localStorage.getItem('movrec_user');
    if (!userData) {
      return null;
    }
    const user = JSON.parse(userData);
    return user.isLoggedIn ? user : null;
  }

  function getAuthToken() {
    const userData = getCurrentUser();
    return userData ? userData.token : null;
  }

  // Helper to get current user ID
  function getCurrentUserId() {
    const user = getCurrentUser();
    return user ? user.id || user._id : null;
  }

  // Function to fetch all reviews for the current movie
  async function fetchMovieReviews() {
    if (!movieData || !movieData.id) return;
    
    try {
      const response = await fetch(`/api/reviews/movie/${movieData.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      reviewList = data;
      renderReviewList();
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  }

  // Function to render the review list with edit/delete icons for current user
  function renderReviewList() {
    reviewContainer.innerHTML = "";
    const currentUserId = getCurrentUserId();
    let reviewsToDisplay = expanded
      ? reviewList
      : reviewList.slice(0, REVIEWS_TO_SHOW);

    reviewsToDisplay.forEach(review => {
      const isCurrentUser = review.userId === currentUserId || review.user === currentUserId;
      const reviewHTML = `
        <div class="d-flex gap-3 align-items-start mb-4 review-entry" data-review-id="${review._id}">
          <img src="${review.profilePic || '../images/profile.jpg'}" class="rounded-circle" width="40" height="40" alt="Profile">
          <div style="flex:1">
            <div class="d-flex align-items-center gap-2 mb-1">
              <strong class="text-light">${review.username}</strong>
              <span class="text-warning small">${generateStarsHTML(review.rating)}</span>
              <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
              ${isCurrentUser ? `
                <span class="ms-auto">
                  <i class="bi bi-pencil-square text-info edit-review" data-review-id="${review._id}" style="cursor:pointer; margin-right:10px;"></i>
                  <i class="bi bi-trash text-danger delete-review" data-review-id="${review._id}" style="cursor:pointer;"></i>
                </span>
              ` : ''}
            </div>
            <p class="text-light mb-0 fs-6">${review.text}</p>
          </div>
        </div>
      `;
      reviewContainer.innerHTML += reviewHTML;
    });

    if (reviewList.length <= REVIEWS_TO_SHOW) {
      reviewSeeMoreBtn.classList.add("d-none");
    } else {
      reviewSeeMoreBtn.classList.remove("d-none");
      reviewSeeMoreBtn.textContent = expanded ? "See Less" : "See More";
    }

    attachReviewActionHandlers();
  }

  // Attach event listeners for edit and delete icons
  function attachReviewActionHandlers() {
    // Delete
    document.querySelectorAll('.delete-review').forEach(icon => {
      icon.addEventListener('click', function(e) {
        e.stopPropagation();
        const reviewId = this.getAttribute('data-review-id');
        // Store the reviewId to delete
        document.getElementById('confirmDeleteReviewBtn').setAttribute('data-review-id', reviewId);
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('deleteReviewModal'));
        modal.show();
      });
    });
    // Edit
    document.querySelectorAll('.edit-review').forEach(icon => {
      icon.addEventListener('click', function(e) {
        e.stopPropagation();
        const reviewId = this.getAttribute('data-review-id');
        const review = reviewList.find(r => r._id === reviewId);
        if (!review) return;
        // Move review text to comment box
        document.getElementById('review-text').value = review.text;
        // Set stars
        updateReviewStars(review.rating);
        reviewSelectedRating = review.rating;
        // Change button to Save Changes
        const submitBtn = document.querySelector('#review-form button[type="submit"]');
        if (!originalButtonText) originalButtonText = submitBtn.textContent;
        submitBtn.textContent = 'Save Changes';
        editingReviewId = reviewId;
      });
    });
  }

  // Handle delete confirmation
  document.getElementById('confirmDeleteReviewBtn').addEventListener('click', async function() {
    const reviewId = this.getAttribute('data-review-id');
    if (!reviewId) return;
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete review');
      // Re-fetch reviews and update stats
      await fetchMovieReviews();
      await updateMovieStats();
      // Hide modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('deleteReviewModal'));
      modal.hide();
    } catch (err) {
      showCustomMessage(err.message || 'Failed to delete review.');
    }
  });
      
  // Update form submission to handle edit mode
  document.getElementById('review-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
      const user = getCurrentUser();
      const token = getAuthToken();
      if (!user || !token) {
        showCustomMessage("Please log in to submit a review.");
        return;
      }
      if (!movieData || !movieData.id) {
        showCustomMessage("Movie information not found. Please try again.");
        return;
      }
      if (reviewSelectedRating === 0) {
        showCustomMessage("Please select a rating.");
        return;
      }
      const reviewText = document.getElementById('review-text').value.trim();
      if (!reviewText) {
        showCustomMessage("Please enter a review.");
        return;
      }
      const submitBtn = document.querySelector('#review-form button[type="submit"]');
      // If editing
      if (editingReviewId) {
        try {
          const response = await fetch(`/api/reviews/${editingReviewId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ rating: reviewSelectedRating, text: reviewText })
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Failed to update review');
          // Re-fetch reviews and update stats
          await fetchMovieReviews();
          console.log('DEBUG: reviewList after editing review:', reviewList);
          await updateMovieStats();
          // Reset form
          this.reset();
          updateReviewStars(0);
          reviewSelectedRating = 0;
          editingReviewId = null;
          submitBtn.textContent = originalButtonText || 'Submit Review';
        } catch (err) {
          showCustomMessage(err.message || 'Failed to update review.');
        }
        return;
      }
      // POST logic for new review
      try {
        const requestData = {
          movieId: movieData.id.toString(),
          rating: reviewSelectedRating,
          text: reviewText
        };
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(requestData)
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message || 'Failed to submit review');
        }
        // Reset form first
        this.reset();
        updateReviewStars(0);
        reviewSelectedRating = 0;
        reviewCurrentDisplayed = 0;
        // Then fetch updated data
        await fetchMovieReviews();
        await updateMovieStats();
      } catch (err) {
        showCustomMessage(err.message || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      console.error('Error in submit handler:', err);
    }
  });

  async function updateMovieStats() {
    // Get current movie ID
    const currentMovieId = sessionStorage.getItem('currentMovieId');
    const movieData = JSON.parse(sessionStorage.getItem('selectedMovie'));
    const movieId = currentMovieId || (movieData ? movieData.id : null);
    
    if (!movieId) {
      return;
    }
    
    // Get TMDB average from sessionStorage (movie-specific)
    const tmdbAvgKey = `tmdbAvg_${movieId}`;
    const tmdbCountKey = `tmdbCount_${movieId}`;
    const tmdbRaw = parseFloat(sessionStorage.getItem(tmdbAvgKey));
    // Get TMDB vote count, but only if it exists and is valid
    const tmdbCountStr = sessionStorage.getItem(tmdbCountKey);
    const tmdbCount = tmdbCountStr ? parseInt(tmdbCountStr) : null;
    // Convert TMDB rating to 5-star scale
    const tmdbStars = isNaN(tmdbRaw) ? 0 : (tmdbRaw / 10 * 5);
    // Get all user ratings from reviewList
    const userRatings = reviewList.map(r => r.rating);
    const userSum = userRatings.reduce((a, b) => a + b, 0);
    const userCount = userRatings.length;
    
    // Calculate the combined average
    let combinedAvg;
    if (userCount === 0 && !tmdbCount) {
      combinedAvg = 0;
    } else if (userCount === 0) {
      combinedAvg = tmdbStars;
    } else if (!tmdbCount) {
      // If no TMDB vote count, just use user average
      combinedAvg = userSum / userCount;
    } else {
      // Use weighted average when we have both TMDB and user data
      combinedAvg = (tmdbStars * tmdbCount + userSum) / (tmdbCount + userCount);
    }
    
    // Display the combined average
    const ratingDisplay = document.getElementById('movie-rating');
    if (ratingDisplay) {
      ratingDisplay.innerHTML = `<strong>Average Rating:</strong> ${combinedAvg.toFixed(1)} ${generateStarsHTML(combinedAvg)}`;
      ratingDisplay.classList.remove('d-none');
    }
  }

  reviewSeeMoreBtn.addEventListener('click', () => {
    expanded = !expanded;
    renderReviewList();
  });

  // Wait for tmdbAvg to be set in sessionStorage before initial load
  async function waitForTmdbAvg() {
    return new Promise((resolve) => {
      // Get current movie ID
      const currentMovieId = sessionStorage.getItem('currentMovieId');
      const movieData = JSON.parse(sessionStorage.getItem('selectedMovie'));
      const movieId = currentMovieId || (movieData ? movieData.id : null);
      
      if (!movieId) {
        resolve();
        return;
      }
      
      const tmdbAvgKey = `tmdbAvg_${movieId}`;
      
      // Check if data is already available
      if (sessionStorage.getItem(tmdbAvgKey)) {
        resolve();
        return;
      }
      
      // Listen for the custom event
      const handleTmdbDataReady = (event) => {
        if (event.detail.movieId == movieId) {
          window.removeEventListener('tmdbDataReady', handleTmdbDataReady);
          resolve();
        }
      };
      
      window.addEventListener('tmdbDataReady', handleTmdbDataReady);
      
      // Fallback: poll for data (in case event doesn't fire)
      let tries = 0;
      const maxTries = 50; // 5 seconds
      const pollInterval = setInterval(() => {
        tries++;
        if (sessionStorage.getItem(tmdbAvgKey)) {
          clearInterval(pollInterval);
          window.removeEventListener('tmdbDataReady', handleTmdbDataReady);
          resolve();
        } else if (tries >= maxTries) {
          clearInterval(pollInterval);
          window.removeEventListener('tmdbDataReady', handleTmdbDataReady);
          resolve();
        }
      }, 100);
    });
  }

  // Start the initialization sequence
  (async function() {
    // Step 1: Wait for TMDB data to be fetched and stored
    await waitForTmdbAvg();
    
    // Step 2: Fetch user reviews
    await fetchMovieReviews();
    
    // Step 3: Calculate and display the combined average
    await updateMovieStats();
  })();
}

// Wait for DOM to be ready, then wait for movie.js to complete before initializing reviews
document.addEventListener("DOMContentLoaded", function () {
  // Wait a bit to ensure movie.js has started its work
  setTimeout(() => {
    // Check if movie.js has already completed its work
    const movieId = sessionStorage.getItem('currentMovieId');
    if (movieId && window.movieJsReady) {
      const tmdbAvgKey = `tmdbAvg_${movieId}`;
      if (sessionStorage.getItem(tmdbAvgKey)) {
        initializeReviews();
      } else {
        // Wait for the tmdbDataReady event
        const handleTmdbDataReady = (event) => {
          window.removeEventListener('tmdbDataReady', handleTmdbDataReady);
          initializeReviews();
        };
        window.addEventListener('tmdbDataReady', handleTmdbDataReady);
      }
    } else if (window.movieJsReady) {
      initializeReviews();
    } else {
      // Wait for movie.js to complete
      let tries = 0;
      const maxTries = 100; // 10 seconds
      const pollInterval = setInterval(() => {
        tries++;
        if (window.movieJsReady) {
          clearInterval(pollInterval);
          initializeReviews();
        } else if (tries >= maxTries) {
          clearInterval(pollInterval);
          initializeReviews();
        }
      }, 100);
    }
  }, 100);
});

function showCustomMessage(message, title = "Message") {
  // Set the modal title and body
  document.getElementById('customMessageModalBody').textContent = message;

  // Show the modal (Bootstrap 5)
  const modal = new bootstrap.Modal(document.getElementById('customMessageModal'));
  modal.show();
}

