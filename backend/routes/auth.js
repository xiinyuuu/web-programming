// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router; 
// @route   POST /api/auth/login
// @desc    Log in user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
  
      res.status(200).json({
        message: 'Login successful.',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token,
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  });
  
  // @route POST /api/auth/forgot-password
// @desc Handle forgot password request
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Generate a fake reset token (in real apps, email it!)
      const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  
      // In production: Send this link via email
      const resetLink = `http://127.0.0.1:5501/web-programming/html/reset-password.html?token=${resetToken}`;
  
      console.log("Reset link:", resetLink); // simulate email
      res.status(200).json({ message: "Password reset link sent. Check console (or your email)." });
    } catch (err) {
      console.error("Forgot password error:", err);
      res.status(500).json({ message: "Server error." });
    }
  });

  // @route   POST /api/auth/reset-password
// @desc    Handle password reset
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


  