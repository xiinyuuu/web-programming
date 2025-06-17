document.addEventListener("DOMContentLoaded", function () {
  let reviewSelectedRating = 0;
  const reviewStars = document.querySelectorAll('#review-star-rating i');
  const reviewContainer = document.getElementById('review-user-reviews');
  const reviewSeeMoreBtn = document.getElementById('review-see-more-btn');

  let reviewList = [];
  const REVIEWS_TO_SHOW = 5;
  let reviewCurrentDisplayed = 0;
  let expanded = false;

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
    return JSON.parse(userData);
  }

  // Form submission
  document.getElementById('review-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const user = getCurrentUser();
    if (!user) {
      alert("Please log in to submit a review.");
      return;
    }

    if (reviewSelectedRating === 0) {
      alert("Please select a star rating.");
      return;
    }

    const reviewText = document.getElementById('review-text').value;
    const movieId = sessionStorage.getItem('selectedMovie')?.id;

    if (!movieId) {
      alert("Movie information not found. Please try again.");
      return;
    }

    fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        username: user.name,
        movieId: movieId,
        rating: reviewSelectedRating,
        text: reviewText
      })
    })
    .then(res => res.json())
    .then(data => {
      reviewList.unshift(data);
      renderReviewList();
    })
    .catch(err => console.error('Failed to submit review:', err));

    this.reset();
    updateReviewStars(0);
    reviewSelectedRating = 0;

    reviewCurrentDisplayed = 0;
  });

  function renderReviewList() {
    reviewContainer.innerHTML = "";

    let reviewsToDisplay = expanded
      ? reviewList
      : reviewList.slice(0, REVIEWS_TO_SHOW);

    reviewsToDisplay.forEach(review => {
      const starsHTML = '<i class="bi bi-star-fill text-warning"></i>'.repeat(review.rating) +
        '<i class="bi bi-star text-warning"></i>'.repeat(5 - review.rating);

      const reviewHTML = `
        <div class="d-flex gap-3 align-items-start mb-4 review-entry">
          <img src="../images/profile.jpg" class="rounded-circle" width="40" height="40" alt="Profile">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <strong class="text-light">${review.username}</strong>
              <span class="text-warning small">${starsHTML}</span>
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

  reviewSeeMoreBtn.addEventListener('click', () => {
    expanded = !expanded;
    renderReviewList();
  });

  // Fetch initial reviews from backend
  fetch('/api/reviews')
    .then(res => res.json())
    .then(data => {
      reviewList = data;
      renderReviewList();
    })
    .catch(err => console.error('Failed to fetch reviews:', err));
});

