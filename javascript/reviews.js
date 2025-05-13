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

  // Form submission
  document.getElementById('review-form').addEventListener('submit', function (e) {
    e.preventDefault();

    if (reviewSelectedRating === 0) {
      alert("Please select a star rating.");
      return;
    }

    const reviewText = document.getElementById('review-text').value;
    const username = "@username"; // Replace with actual user later

    reviewList.unshift({
      username: username,
      rating: reviewSelectedRating,
      text: reviewText
    });

    this.reset();
    updateReviewStars(0);
    reviewSelectedRating = 0;

    reviewCurrentDisplayed = 0;
    renderReviewList();
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

  // Show or hide the button
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

  // Dummy reviews for testing
  for (let i = 1; i <= 15; i++) {
    reviewList.unshift({
      username: `@user${i}`,
      rating: Math.floor(Math.random() * 5) + 1,
      text: `This is review number ${i}.`
    });
  }

  renderReviewList();
});
