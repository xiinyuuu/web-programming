console.log("🚀 Starting server.js...");

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5500;

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Log environment variables
console.log('Environment Check:');
console.log('- TMDB_API_KEY present:', !!process.env.TMDB_API_KEY);
console.log('- TMDB_API_KEY length:', process.env.TMDB_API_KEY ? process.env.TMDB_API_KEY.length : 0);

// ✅ CORS: Allow localhost (e.g. from browser or Postman)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Body parser with increased limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ Serve static assets
app.use('/html', express.static(path.join(__dirname, '../html')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/stylesheet', express.static(path.join(__dirname, '../stylesheet')));
app.use('/javascript', express.static(path.join(__dirname, '../javascript')));

// ✅ HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/login.html'));
});

app.get('/actor-profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/actor-profile.html'));
});

app.get('/moviedesc.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/moviedesc.html'));
});

app.get('/home.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/home.html'));
});

// Add routes for movies.html and actor.html
app.get('/movies.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/movies.html'));
});

app.get('/actor.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/actor.html'));
});

app.get('/watchlist.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/watchlist.html'));
});

app.get('/search.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/search.html'));
});

app.get('/profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/profile.html'));
});

app.get('/all-my-reviews.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/all-my-reviews.html'));
});

app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/signup.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/login.html'));
});

// ✅ API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/watchlist', require('./routes/watchlist'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/tmdb', require('./routes/tmdb'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/filter', require('./routes/filter'));

// ❌ Catch-all for undefined API routes
app.use((req, res) => {
  console.log('❌ 404 Not Found:', req.method, req.url);
  res.status(404).json({ message: 'Endpoint not found' });
});

// ✅ Connect to MongoDB and start server
console.log("🔌 Connecting to MongoDB Atlas...");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () =>
      console.log(`🚀 Server running: http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
