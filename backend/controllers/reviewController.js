const Review = require('../models/Review');
const User = require('../models/user');

// Get all reviews for a specific movie
exports.getMovieReviews = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    
    // Get all users with their IDs to filter reviews
    const users = await User.find({}, '_id username');
    const validUserIds = users.map(user => user._id.toString());

    // Only get reviews from users that still exist
    const reviews = await Review.find({ 
      movieId,
      userId: { $in: validUserIds }
    }).sort({ createdAt: -1 });

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
    const { movieId, rating, text } = req.body;
    
    // Log the entire user object from the token
    console.log('🔵 Creating review with user:', req.user);
    
    // Get userId from the token payload
    const userId = req.user.id;
    
    if (!userId) {
      console.error('❌ No user ID in token:', req.user);
      return res.status(401).json({ message: 'Invalid user ID in token' });
    }

    // Get username from user document
    const user = await User.findById(userId);
    if (!user) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Found user:', {
      id: user._id,
      username: user.username
    });

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({ userId, movieId });
    if (existingReview) {
      console.log('⚠️ User already reviewed this movie:', {
        userId,
        movieId,
        existingReview: existingReview._id
      });
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }

    const review = new Review({
      userId,
      username: user.username,
      movieId,
      rating,
      text,
      createdAt: new Date()
    });

    await review.save();
    console.log('✅ Review created:', {
      id: review._id,
      movieId,
      rating
    });

    res.status(201).json(review);
  } catch (err) {
    console.error('❌ Error creating review:', err);
    res.status(500).json({ message: 'Error creating review', error: err.message });
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
    const userId = req.user.id;  // Updated to match token structure
    const reviews = await Review.find({ userId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user reviews', error: err.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, text } = req.body;
    const userId = req.user.id;  // Updated to match token structure

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found or not authorized' });
    }

    review.rating = rating;
    review.text = text;
    await review.save();

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error updating review', error: err.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;  // Updated to match token structure

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found or not authorized' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review', error: err.message });
  }
}; 