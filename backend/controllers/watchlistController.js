const User = require('../models/user');

// Get user's watchlist
exports.getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add movie to watchlist
exports.addToWatchlist = async (req, res) => {
  const { movieId, title, poster } = req.body;

  if (!movieId || !title || !poster) {
    return res.status(400).json({ message: 'Missing movieId, title, or poster' });
  }

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Normalize for comparison
    const normalizedMovieId = movieId.trim().toLowerCase();

    // Check if movie already in watchlist
    const alreadyExists = user.watchlist.some(
      movie => movie.movieId.trim().toLowerCase() === normalizedMovieId
    );
    if (alreadyExists) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    // Add movie with watched default to false
    user.watchlist.push({ movieId: normalizedMovieId, title, poster, watched: false });
    await user.save();

    res.json({ message: 'Movie added to watchlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove movie from watchlist
exports.removeFromWatchlist = async (req, res) => {
  const { movieId } = req.body;

  if (!movieId) return res.status(400).json({ message: 'movieId required' });

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const normalizedMovieId = movieId.trim().toLowerCase();

    user.watchlist = user.watchlist.filter(
      movie => movie.movieId.trim().toLowerCase() !== normalizedMovieId
    );

    await user.save();
    res.json({ message: 'Movie removed from watchlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle watched/unwatched status
exports.toggleWatched = async (req, res) => {
  const { movieId } = req.body;

  if (!movieId) return res.status(400).json({ message: 'movieId required' });

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const normalizedMovieId = movieId.trim().toLowerCase();
    const movie = user.watchlist.find(
      m => m.movieId.trim().toLowerCase() === normalizedMovieId
    );

    if (!movie) return res.status(404).json({ message: 'Movie not in watchlist' });

    movie.watched = !movie.watched;
    await user.save();

    res.json({ message: 'Watch status updated', watched: movie.watched });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
