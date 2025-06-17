const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const jwt = require('jsonwebtoken');

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// GET profile
router.get('/', authenticateToken, profileController.getProfile);
// UPDATE profile info
router.put('/', authenticateToken, profileController.updateProfile);
// UPDATE password
router.put('/password', authenticateToken, profileController.changePassword);
// DEACTIVATE account
router.put('/deactivate', authenticateToken, profileController.deactivateAccount);
// DELETE account
router.delete('/', authenticateToken, profileController.deleteAccount);
// UPDATE profile picture
router.put('/profile-pic', authenticateToken, profileController.updateProfilePic);

module.exports = router;
