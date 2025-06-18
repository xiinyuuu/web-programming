const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filterController');

// Route for filtered movies
router.get('/movies', filterController.getFilteredMovies);

// Route for getting all genres
router.get('/genres', filterController.getGenres);

module.exports = router; 