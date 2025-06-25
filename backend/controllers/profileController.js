const User = require('../models/user'); // Adjust the path as needed
const bcrypt = require('bcryptjs');
const Review = require('../models/Review'); // Add this at the top
const axios = require('axios');
const mongoose = require('mongoose');

// GET profile data
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('🔵 Getting profile for user:', userId);

    // Use findOneAndUpdate to ensure deactivated is false when profile is accessed
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { deactivated: false } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log('✅ User found and updated:', {
      id: user._id,
      deactivated: user.deactivated
    });

    // Get review count and reviews (limited to 3 for profile page)
    const reviews = await Review.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);

    // Fetch movie details for each review
    const reviewsWithMovieDetails = await Promise.all(reviews.map(async (review) => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${review.movieId}?api_key=${process.env.TMDB_API_KEY}`
        );
        const movie = response.data;
        
        // Fetch the user for profilePic
        const reviewUser = await User.findById(review.userId);
        return {
          id: review._id,
          movieId: review.movieId,
          title: movie.title,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          genre: movie.genres[0]?.name || 'Unknown',
          year: new Date(movie.release_date).getFullYear(),
          rating: review.rating,
          review: review.text,
          date: review.createdAt,
          duration: movie.runtime ? formatDuration(movie.runtime) : '',
          profilePic: reviewUser && reviewUser.profilePic ? reviewUser.profilePic : '/images/profile.jpg',
        };
      } catch (error) {
        console.error(`Error fetching movie details for ${review.movieId}:`, error);
        return null;
      }
    }));

    // Filter out any null results from failed movie fetches
    const validReviews = reviewsWithMovieDetails.filter(review => review !== null);

    // Add counts and reviews to response
    const profileData = {
      ...user.toJSON(),
      reviewCount: await Review.countDocuments({ userId }),
      reviews: validReviews
    };

    res.status(200).json(profileData);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET all reviews for a user (for All My Reviews page)
exports.getAllReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('🔵 Getting all reviews for user:', userId);

    // Get all reviews without limit
    const reviews = await Review.find({ userId })
      .sort({ createdAt: -1 });

    console.log(`📊 Found ${reviews.length} reviews for user ${userId}`);

    // Fetch movie details for each review
    const reviewsWithMovieDetails = await Promise.all(reviews.map(async (review) => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${review.movieId}?api_key=${process.env.TMDB_API_KEY}`
        );
        const movie = response.data;
        
        // Fetch the user for profilePic
        const reviewUser = await User.findById(review.userId);
        return {
          id: review._id,
          movieId: review.movieId,
          title: movie.title,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          genre: movie.genres[0]?.name || 'Unknown',
          year: new Date(movie.release_date).getFullYear(),
          rating: review.rating,
          review: review.text,
          date: review.createdAt,
          duration: movie.runtime ? formatDuration(movie.runtime) : '',
          profilePic: reviewUser && reviewUser.profilePic ? reviewUser.profilePic : '/images/profile.jpg',
        };
      } catch (error) {
        console.error(`Error fetching movie details for ${review.movieId}:`, error);
        return null;
      }
    }));

    // Filter out any null results from failed movie fetches
    const validReviews = reviewsWithMovieDetails.filter(review => review !== null);

    console.log(`✅ Returning ${validReviews.length} valid reviews`);

    res.status(200).json({ reviews: validReviews });
  } catch (err) {
    console.error('❌ Error getting all reviews:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE profile info (name/email)
exports.updateProfile = async (req, res) => {
  const { username, email } = req.body;

  try {
    const userId = req.user.id;
    
    // First check if the new username is already taken by another user
    const existingUser = await User.findOne({ 
      username, 
      _id: { $ne: userId } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update username in all reviews by this user
    await Review.updateMany(
      { userId },
      { username: username }
    );

    // Get updated review count and reviews
    const reviewCount = await Review.countDocuments({ userId });
    const reviews = await Review.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);

    // Fetch movie details for reviews
    const reviewsWithMovieDetails = await Promise.all(reviews.map(async (review) => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${review.movieId}?api_key=${process.env.TMDB_API_KEY}`
        );
        const movie = response.data;
        
        return {
          id: review._id,
          movieId: review.movieId,
          title: movie.title,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          genre: movie.genres[0]?.name || 'Unknown',
          year: new Date(movie.release_date).getFullYear(),
          rating: review.rating,
          review: review.text,
          date: review.createdAt,
          duration: movie.runtime ? formatDuration(movie.runtime) : '',
        };
      } catch (error) {
        console.error(`Error fetching movie details for ${review.movieId}:`, error);
        return null;
      }
    }));

    // Filter out any null results
    const validReviews = reviewsWithMovieDetails.filter(review => review !== null);

    // Add review count and reviews to response
    const profileData = {
      ...updatedUser.toJSON(),
      reviewCount,
      reviews: validReviews
    };

    res.status(200).json(profileData);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

// UPDATE password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE account
exports.deleteAccount = async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Delete all reviews by this user first
    await Review.deleteMany({ userId: req.user.id });
    
    // Then delete the user
    await User.findByIdAndDelete(req.user.id);
    
    res.status(200).json({ message: 'Account and all associated data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete account', error: err.message });
  }
};

// (Optional) Deactivate account — here we just hide the account
exports.deactivateAccount = async (req, res) => {
  console.log('🔵 DEACTIVATION ATTEMPT:', {
    userId: req.user.id,
    timestamp: new Date().toISOString()
  });

  try {
    const userId = req.user.id;
    const objectId = new mongoose.Types.ObjectId(userId);

    console.log('🔄 Starting deactivation process:', {
      userId: userId,
      objectId: objectId.toString()
    });

    // Direct MongoDB update
    const db = mongoose.connection.db;
    const result = await db.collection('user').updateOne(
      { _id: objectId },
      { $set: { deactivated: true } }
    );

    console.log('📝 MongoDB deactivation result:', {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      acknowledged: result.acknowledged
    });

    // Verify the update worked
    const updatedUser = await db.collection('user').findOne({ _id: objectId });
    
    console.log('🔍 User state after deactivation:', {
      id: updatedUser._id.toString(),
      deactivated: updatedUser.deactivated,
      updateWorked: updatedUser.deactivated === true
    });

    if (!updatedUser.deactivated) {
      console.error('⚠️ WARNING: Failed to set deactivated status to true!');
      console.error('Debug info:', {
        userId: userId,
        updateResult: result
      });
    } else {
      console.log('✅ Account successfully deactivated');
    }

    res.status(200).json({ 
      message: 'Account deactivated',
      deactivated: updatedUser.deactivated
    });
  } catch (err) {
    console.error('❌ Deactivation error:', err);
    res.status(500).json({ message: 'Deactivation failed', error: err.message });
  }
};

// UPDATE profile picture
exports.updateProfilePic = async (req, res) => {
  try {
    const userId = req.user.id;
    const { image } = req.body; // Base64 encoded image

    console.log('🔵 Updating profile picture for user:', userId);

    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Update user's profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          profilePic: image,
          lastUpdated: new Date()
        } 
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Profile picture updated for user:', userId);

    res.status(200).json({
      message: 'Profile picture updated successfully',
      profilePic: updatedUser.profilePic
    });
  } catch (err) {
    console.error('❌ Error updating profile picture:', err);
    res.status(500).json({ message: 'Failed to update profile picture' });
  }
};

// Add a helper to format duration as '2h 49m'
function formatDuration(runtime) {
  if (!runtime || isNaN(runtime)) return '';
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours > 0 ? hours + 'h ' : ''}${minutes}m`;
}

module.exports = {
  getProfile: exports.getProfile,
  updateProfile: exports.updateProfile,
  changePassword: exports.changePassword,
  deleteAccount: exports.deleteAccount,
  deactivateAccount: exports.deactivateAccount,
  updateProfilePic: exports.updateProfilePic,
  getAllReviews: exports.getAllReviews
};
