// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const { registerUser, loginUser, verifyUser } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { sendPasswordResetEmail } = require('../services/mailService'); 

const router = express.Router();

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// ============================
// @route   POST /api/auth/register
// @desc    Register new user
// ============================
router.post('/register', registerUser);

// ============================
// @route   POST /api/auth/login
// @desc    Log in user
// ============================
router.post('/login', loginUser);

// ============================
// @route   GET /api/auth/verify
// @desc    Verify user
// ============================
router.get('/verify', auth, verifyUser);

// ============================
// @route   POST /api/auth/forgot-password
// @desc    Handle forgot password request
// ============================
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Security best practice: Don't reveal if an email exists or not.
      // Send a generic success message either way.
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.status(200).json({
        message: 'If an account with this email exists, a password reset link has been sent.',
      });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m', // Link is valid for 15 minutes
    });

    const frontendBaseUrl = req.headers.origin || 'http://localhost:5500/html';
    const resetLink = `${frontendBaseUrl}/reset-password.html?token=${resetToken}`;

    // --- THIS IS THE UPDATED PART ---
    // Instead of console.log, we call our email function.
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({
      message: 'If an account with this email exists, a password reset link has been sent.',
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    // Don't leak specific error details to the client
    res.status(500).json({ message: 'An internal server error occurred. Please try again later.' });
  }
});

// ============================
// @route   POST /api/auth/reset-password
// @desc    Handle password reset
// ============================
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
});

module.exports = router;
