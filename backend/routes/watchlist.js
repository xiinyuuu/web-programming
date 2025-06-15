const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const watchlistController = require('../controllers/watchlistController');

// Middleware to validate userId format
router.param('userId', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid userId format' });
  }
  next();
});

// GET /api/watchlist/:userId
router.get('/:userId', watchlistController.getWatchlist);

// POST /api/watchlist/:userId/add
router.post('/:userId/add', watchlistController.addToWatchlist);

// DELETE /api/watchlist/:userId/remove
router.delete('/:userId/remove', watchlistController.removeFromWatchlist);

// PATCH /api/watchlist/:userId/toggle
router.patch('/:userId/toggle', watchlistController.toggleWatched);

module.exports = router;
