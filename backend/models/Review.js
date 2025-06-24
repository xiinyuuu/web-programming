const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: { 
    type: String, 
    required: true 
  },
  movieId: {
    type: String,
    required: true
  },
  rating: { 
    type: Number, 
    required: true,
    min: 0,
    max: 5
  },
  text: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

// Add index for faster queries
reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
