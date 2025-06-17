const mongoose = require('mongoose');

// Watchlist item schema
const watchlistSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true,
    set: v => v.trim().toLowerCase() // Normalize movieId
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  poster: {
    type: String,
    trim: true
  },
  watched: {
    type: Boolean,
    default: false
  }
});

// User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deactivated: { 
    type: Boolean, 
    default: false 
  },
  watchlist: [watchlistSchema],
  profilePic: {
    type: String,
    default: ''
  }
}, { 
  collection: 'user',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for movies watched count
userSchema.virtual('moviesWatchedCount').get(function() {
  return this.watchlist.filter(movie => movie.watched).length;
});

// Virtual for watchlist count
userSchema.virtual('watchlistCount').get(function() {
  return this.watchlist.length;
});

module.exports = mongoose.model('User', userSchema);
