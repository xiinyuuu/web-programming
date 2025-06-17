const Review = require('../models/Review');
const User = require('../models/user');

// Get all reviews for a specific movie
exports.getMovieReviews = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const reviews = await Review.find({ movieId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching movie reviews:', error);
    res.status(500).json({ message: 'Failed to fetch movie reviews' });
  }
};

// Get all reviews (with optional movie filter)
exports.getAllReviews = async (req, res) => {
  try {
    const query = {};
    if (req.query.movieId) {
      query.movieId = req.query.movieId;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { username, movieId, rating, text } = req.body;

    // Validate required fields
    if (!username || !movieId || !rating || !text) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({ movieId, username });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }

    const newReview = new Review({
      username,
      movieId,
      rating,
      text
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }
    console.error('Error creating review:', error);
    res.status(400).json({ message: 'Error creating review' });
  }
};

// Get movie review statistics
exports.getMovieStats = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const reviews = await Review.find({ movieId });
    
    if (reviews.length === 0) {
      return res.json({
        movieId,
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
      });
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
    
    // Calculate rating distribution
    const ratingDistribution = reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {1: 0, 2: 0, 3: 0, 4: 0, 5: 0});

    res.json({
      movieId,
      totalReviews,
      averageRating,
      ratingDistribution
    });
  } catch (error) {
    console.error('Error fetching movie statistics:', error);
    res.status(500).json({ message: 'Failed to fetch movie statistics' });
  }
};

// Get reviews by user ID
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reviews = await Review.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'username email');
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Failed to fetch user reviews' });
  }
}; 