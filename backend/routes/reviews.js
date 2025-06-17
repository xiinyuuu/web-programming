const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// GET all reviews (with optional movieId filter in query params)
router.get('/', reviewController.getAllReviews);

// GET reviews for a specific movie
router.get('/movie/:movieId', reviewController.getMovieReviews);

// GET statistics for a specific movie
router.get('/movie/:movieId/stats', reviewController.getMovieStats);

// POST a new review
router.post('/', reviewController.createReview);

module.exports = router;
