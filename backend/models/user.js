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

// Pre-save middleware to handle deactivated status
userSchema.pre('save', function(next) {
  // Log the current state
  console.log('Pre-save hook - User state:', {
    id: this._id,
    username: this.username,
    deactivated: this.deactivated,
    isModified: this.isModified('deactivated')
  });

  // Ensure deactivated is a boolean
  if (this.deactivated !== undefined) {
    this.deactivated = Boolean(this.deactivated);
  }

  next();
});

// Add pre-findOneAndUpdate middleware
userSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  
  console.log('Pre-update hook - Update operation:', {
    conditions: this.getQuery(),
    update: update,
    options: this.getOptions()
  });

  // Ensure deactivated is a boolean if it's being updated
  if (update.$set && update.$set.deactivated !== undefined) {
    update.$set.deactivated = Boolean(update.$set.deactivated);
    console.log('Normalized deactivated value to:', update.$set.deactivated);
  }

  next();
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
