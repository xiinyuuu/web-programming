const Review = require('../models/Review');
const User = require('../models/user');

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username email');
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
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

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { userId, username, movieId, rating, text } = req.body;

    // Validate required fields
    if (!userId || !username || !movieId || !rating || !text) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newReview = new Review({
      user: userId,
      username,
      movieId,
      rating,
      text
    });

    await newReview.save();
    
    // Populate user data before sending response
    const populatedReview = await Review.findById(newReview._id)
      .populate('user', 'username email');
      
    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(400).json({ message: 'Error creating review' });
  }
}; 