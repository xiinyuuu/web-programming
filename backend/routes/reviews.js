const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// GET all reviews (with optional movieId filter in query params)
router.get('/', reviewController.getAllReviews);

// GET reviews for a specific movie
router.get('/movie/:movieId', reviewController.getMovieReviews);

// GET statistics for a specific movie
router.get('/movie/:movieId/stats', reviewController.getMovieStats);

// POST a new review (protected route)
router.post('/', auth, reviewController.createReview);

// GET user's reviews (protected route)
router.get('/user', auth, reviewController.getUserReviews);

// UPDATE a review (protected route)
router.put('/:reviewId', auth, reviewController.updateReview);

// DELETE a review (protected route)
router.delete('/:reviewId', auth, reviewController.deleteReview);

module.exports = router;
