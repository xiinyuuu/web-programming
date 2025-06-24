// server.js (Corrected and Simplified)

console.log("🚀 Starting server.js...");

const path = require('path'); // Require path module once at the top
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5500;

// =========================================================================
//  1. SERVE ALL STATIC/FRONTEND FILES (The Correct Way)
// =========================================================================

// This one line will handle ALL requests for HTML files (e.g., /login.html, /home.html)
app.use(express.static(path.join(__dirname, '../html')));

// These lines handle requests for CSS, JS, and images
app.use('/stylesheet', express.static(path.join(__dirname, '..', 'stylesheet')));
app.use('/javascript', express.static(path.join(__dirname, '..', 'javascript')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

// =========================================================================
//  2. SETUP MIDDLEWARE
// =========================================================================

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// CORS: Allow localhost
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

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// =========================================================================
//  3. DEFINE API ROUTES (Backend Logic)
// =========================================================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/watchlist', require('./routes/watchlist'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/tmdb', require('./routes/tmdb'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/filter', require('./routes/filter'));

app.get('/', (req, res) => {
  res.redirect('/home.html');
});

// =========================================================================
//  4. CONNECT TO DATABASE AND START SERVER
// =========================================================================

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
    process.exit(1); // Exit if DB connection fails
  });