// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const { registerUser, loginUser, verifyUser } = require('../controllers/authController');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

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

// Setup nodemailer transporter for Gmail
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.RESET_EMAIL || 'movrec.team@gmail.com',
//     pass: process.env.RESET_EMAIL_PASS || 'knwtakupcvgonmeg',
//   },
// });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'movrec.team@gmail.com',
    pass: 'knwtakupcvgonmeg', // <-- App Password, no spaces
  },
});

console.log('Sending email with:', {
  user: 'movrec.team@gmail.com',
  pass: 'knwtakupcvgonmeg'
});

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
      return res.status(404).json({ message: 'User not found.' });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    // Use the request origin or fallback to localhost:5500
    const frontendBaseUrl = req.headers.origin || 'http://localhost:5500';
    const resetLink = `${frontendBaseUrl}/reset-password.html?token=${resetToken}`;

    // Send email using nodemailer
    const mailOptions = {
      from: 'MovRec <movrec.team@gmail.com>',
      to: email,
      subject: 'Your Password Reset Link for MovRec',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your MovRec account.</p>
          <p>Please click the button below to set a new password. This link is valid for 15 minutes.</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #1677ff; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px; margin: 16px 0;">Reset Password</a>
          <p style="margin-top: 24px;">If you did not request this, please ignore this email.</p>
          <p style="color: #888; font-style: italic; margin-top: 32px;">MovRec Team</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Password reset link sent. Check your email.',
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error.' });
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
