const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true,
    index: true  // Add index for faster movie-based queries
  },
  username: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  text: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add compound index for movieId and username to prevent duplicate reviews
reviewSchema.index({ movieId: 1, username: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
