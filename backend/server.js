console.log("🚀 Starting server.js...");

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;

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

// ✅ Body parser
app.use(express.json());

// ✅ Serve static assets
app.use(express.static(path.join(__dirname, '../html')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/stylesheet', express.static(path.join(__dirname, '../stylesheet')));
app.use('/javascript', express.static(path.join(__dirname, '../javascript')));

// ✅ Redirect root to login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/login.html'));
});

// ✅ API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/watchlist', require('./routes/watchlist'));
app.use('/api/reviews', require('./routes/reviews'));

// ❌ Catch-all for undefined API routes
app.use((req, res) => {
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
