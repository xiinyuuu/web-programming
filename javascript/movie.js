// Retrieve the movie object from sessionStorage
const movie = JSON.parse(sessionStorage.getItem('selectedMovie'));

if (movie) {
  document.querySelector('#movie-title').textContent = movie.title;
  document.querySelector('#movie-details img').src = movie.img;
  document.querySelector('#movie-details img').alt = movie.title;

  document.querySelector('#movie-rating').innerHTML = `${parseFloat(movie.rating).toFixed(1)} 
    ${generateStars(movie.rating)}`;

  document.querySelector('#movie-duration').innerHTML = `<strong>Duration:</strong> ${movie.duration}`;
  document.querySelector('#movie-year').innerHTML = `<strong>Year:</strong> ${movie.year}`;
  document.querySelector('#movie-genre').innerHTML = `<strong>Genre:</strong> ${movie.genre.join(', ')}`;
  document.querySelector('#movie-director').innerHTML = `<strong>Director:</strong> ${movie.director}`;
  document.querySelector('#movie-synopsis').innerHTML = `<strong>Synopsis:</strong> ${movie.synopsis}`;
} else {
  document.querySelector('#movie-details').innerHTML = "<p class='text-light'>Movie not found.</p>";
}

// Star generator
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
