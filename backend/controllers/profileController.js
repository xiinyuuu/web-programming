const User = require('../models/user'); // Adjust the path as needed
const bcrypt = require('bcryptjs');
const Review = require('../models/Review'); // Add this at the top
const axios = require('axios');

// GET profile data
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated
    const user = await User.findById(userId).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get review count and reviews
    const reviews = await Review.find({ username: user.username })
      .sort({ createdAt: -1 })
      .limit(3);

    // Fetch movie details for each review
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
          date: review.createdAt
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
      reviewCount: await Review.countDocuments({ username: user.username }),
      reviews: validReviews
    };

    res.status(200).json(profileData);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE profile info (name/email)
exports.updateProfile = async (req, res) => {
  const { username, email } = req.body;

  try {
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');

    // Get review count
    const reviewCount = await Review.countDocuments({ username: updatedUser.username });

    // Add review count to response
    const profileData = {
      ...updatedUser.toJSON(),
      reviewCount
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

    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete account', error: err.message });
  }
};

// (Optional) Deactivate account — here we just hide the account
exports.deactivateAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { deactivated: true }); // Add `deactivated` field if needed

    res.status(200).json({ message: 'Account deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Deactivation failed', error: err.message });
  }
};

exports.updateProfilePic = async (req, res) => {
  const { profilePic } = req.body;
  try {
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic },
      { new: true, runValidators: true }
    ).select('-password');

    // Get review count
    const reviewCount = await Review.countDocuments({ username: updatedUser.username });

    // Add review count to response
    const profileData = {
      ...updatedUser.toJSON(),
      reviewCount
    };

    res.status(200).json(profileData);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update profile picture', error: err.message });
  }
};
