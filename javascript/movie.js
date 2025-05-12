
// Retrieve the movie title from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const movieTitle = urlParams.get('title');

  // Find the movie object that matches the title
  const movie = movies.find(m => m.title === movieTitle);

 // If a movie was found, populate the page with its details
if (movie) {
  document.querySelector('#movie-title').textContent = movie.title;
  document.querySelector('#movie-details img').src = `../images/${movie.img}`;
  document.querySelector('#movie-details img').alt = movie.title;

  // Set the rating number and stars dynamically with one decimal place
  document.querySelector('#movie-rating').innerHTML = `${movie.rating.toFixed(1)} 
    ${generateStars(movie.rating)}`;

  // Fill in the other details
  document.querySelector('#movie-duration').innerHTML = `<strong>Duration:</strong> ${movie.duration}`;
  document.querySelector('#movie-year').innerHTML = `<strong>Year:</strong> ${movie.year}`;
  document.querySelector('#movie-genre').innerHTML = `<strong>Genre:</strong> ${movie.genre.join(', ')}`;
  document.querySelector('#movie-director').innerHTML = `<strong>Director:</strong> ${movie.director}`;
  document.querySelector('#movie-synopsis').innerHTML = `<strong>Synopsis:</strong> ${movie.synopsis}`;

} else {
  // If no movie is found, show a fallback message
  document.querySelector('#movie-details').innerHTML = "<p class='text-light'>Movie not found.</p>";
}

  // Function to generate the star rating string with Bootstrap icons
  function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('<i class="bi bi-star-fill"></i>');
    }

    if (halfStar) {
      stars.push('<i class="bi bi-star-half"></i>');
    }

    for (let i = stars.length; i < 5; i++) {
      stars.push('<i class="bi bi-star"></i>');
    }

    return stars.join(' ');
  }
