const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// GET all reviews
router.get('/', reviewController.getAllReviews);

// GET reviews by user ID
router.get('/user/:userId', reviewController.getUserReviews);

// POST a new review
router.post('/', reviewController.createReview);

module.exports = router;
