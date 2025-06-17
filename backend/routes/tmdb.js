const express = require('express');
const router = express.Router();
const tmdbController = require('../controllers/tmdbController');

// Route for trending movies
router.get('/trending/movies', tmdbController.getTrendingMovies);

// Route for trending actors
router.get('/trending/actors', tmdbController.getTrendingActors);

// Route for popular movies with pagination
router.get('/movies/popular', tmdbController.getPopularMovies);

// Route for movie details
router.get('/movies/:id', tmdbController.getMovieDetails);

// Route for movie cast
router.get('/movies/:id/credits', tmdbController.getMovieCredits);

// Route for popular actors with pagination
router.get('/actors/popular', tmdbController.getPopularActors);

// Route for actor details
router.get('/actors/:id', tmdbController.getActorDetails);

// Route for actor filmography
router.get('/actors/:id/movies', tmdbController.getActorFilmography);

module.exports = router;
