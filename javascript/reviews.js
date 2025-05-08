document.addEventListener("DOMContentLoaded", function () {
  let reviewSelectedRating = 0;
  const reviewStars = document.querySelectorAll('#review-star-rating i');
  const reviewContainer = document.getElementById('review-user-reviews');
  const reviewSeeMoreBtn = document.getElementById('review-see-more-btn');

  let reviewList = [];
  const REVIEWS_TO_SHOW = 5;
  let reviewCurrentDisplayed = 0;

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
    const username = "@username"; // Placeholder

    reviewList.push({
      username: username,
      rating: reviewSelectedRating,
      text: reviewText
    });

    this.reset();
    updateReviewStars(0);
    reviewSelectedRating = 0;

    renderReviewList();
  });

  function renderReviewList() {
    reviewContainer.innerHTML = "";

    const reviewsToDisplay = reviewList.slice(0, reviewCurrentDisplayed + REVIEWS_TO_SHOW);
    reviewsToDisplay.forEach(review => {
      const starsHTML = '<i class="bi bi-star-fill text-warning"></i>'.repeat(review.rating) +
        '<i class="bi bi-star text-warning"></i>'.repeat(5 - review.rating);

      const reviewHTML = `
        <div class="border rounded p-3 mb-3 bg-dark">
          <strong class="text-light">${review.username}</strong>
          <p class="mb-1 text-warning">${starsHTML}</p>
          <p class="text-light">${review.text}</p>
        </div>
      `;
      reviewContainer.innerHTML += reviewHTML;
    });

    reviewCurrentDisplayed = reviewsToDisplay.length;
    reviewSeeMoreBtn.classList.toggle('d-none', reviewList.length <= reviewCurrentDisplayed);
  }

  reviewSeeMoreBtn.addEventListener('click', renderReviewList);

  // Optional dummy reviews
  for (let i = 1; i <= 25; i++) {
    reviewList.push({
      username: `@user${i}`,
      rating: Math.floor(Math.random() * 5) + 1,
      text: `This is review number ${i}.`
    });
  }

  renderReviewList();
});