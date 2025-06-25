document.addEventListener("DOMContentLoaded", function () {
  let reviewSelectedRating = 0;
  const reviewStars = document.querySelectorAll('#review-star-rating i');
  const reviewContainer = document.getElementById('review-user-reviews');
  const reviewSeeMoreBtn = document.getElementById('review-see-more-btn');
  const movieData = JSON.parse(sessionStorage.getItem('selectedMovie'));

  let reviewList = [];
  const REVIEWS_TO_SHOW = 5;
  let reviewCurrentDisplayed = 0;
  let expanded = false;

  // Generate stars HTML helper function
  function generateStarsHTML(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="bi bi-star-fill text-warning"></i>';
    }
    if (halfStar) {
      stars += '<i class="bi bi-star-half text-warning"></i>';
    }
    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
      stars += '<i class="bi bi-star text-warning"></i>';
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

  // Form submission
  document.getElementById('review-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const user = getCurrentUser();
    const token = getAuthToken();
    
    console.log('User data:', user);
    console.log('Token:', token);
    
    if (!user || !token) {
      showCustomMessage("Please log in to submit a review.");
      return;
    }

    if (!movieData || !movieData.id) {
      console.error('Movie data missing:', movieData);
      showCustomMessage("Movie information not found. Please try again.");
      return;
    }

    if (reviewSelectedRating === 0) {
      showCustomMessage("Please select a star rating.");
      return;
    }

    const reviewText = document.getElementById('review-text').value;
    const requestData = {
      movieId: movieData.id.toString(),
      rating: reviewSelectedRating,
      text: reviewText
    };

    console.log('Submitting review:', requestData);
    console.log('Headers:', {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

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
      console.error('Failed to submit review:', err);
      showCustomMessage(err.message || 'Failed to submit review. Please try again.');
    }
  });

  function renderReviewList() {
    reviewContainer.innerHTML = "";

    let reviewsToDisplay = expanded
      ? reviewList
      : reviewList.slice(0, REVIEWS_TO_SHOW);

    reviewsToDisplay.forEach(review => {
      const reviewHTML = `
        <div class="d-flex gap-3 align-items-start mb-4 review-entry">
          <img src="${review.profilePic || '../images/profile.jpg'}" class="rounded-circle" width="40" height="40" alt="Profile">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <strong class="text-light">${review.username}</strong>
              <span class="text-warning small">${generateStarsHTML(review.rating)}</span>
              <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
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
  }

  async function updateMovieStats() {
    // Get TMDB average from sessionStorage
    const tmdbAvg = parseFloat(sessionStorage.getItem('tmdbAvg'));
    // Get all user ratings from reviewList
    const userRatings = reviewList.map(r => r.rating);
    const sum = userRatings.reduce((a, b) => a + b, 0);
    // Calculate the combined average
    let combinedAvg;
    if (userRatings.length === 0 || isNaN(tmdbAvg)) {
      combinedAvg = tmdbAvg;
    } else {
      combinedAvg = (tmdbAvg + sum) / (userRatings.length + 1);
    }
    // Debug logging
    console.log('TMDB avg:', tmdbAvg);
    console.log('User ratings:', userRatings);
    console.log('Combined avg:', combinedAvg);
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
    let tries = 0;
    while (!sessionStorage.getItem('tmdbAvg') && tries < 20) {
      await new Promise(res => setTimeout(res, 100));
      tries++;
    }
  }

  // Initial load
  (async function() {
    await waitForTmdbAvg();
    await fetchMovieReviews();
    await updateMovieStats();
  })();
});

function showCustomMessage(message, title = "Message") {
  // Set the modal title and body
  document.getElementById('customMessageModalBody').textContent = message;

  // Show the modal (Bootstrap 5)
  const modal = new bootstrap.Modal(document.getElementById('customMessageModal'));
  modal.show();
}

