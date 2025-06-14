console.log("🚀 Starting server.js...");

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;

// ✅ Flexible CORS for Live Server and frontend
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ✅ Serve static files from html, images, stylesheet, javascript
app.use(express.static(path.join(__dirname, '../html')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/stylesheet', express.static(path.join(__dirname, '../stylesheet')));
app.use('/javascript', express.static(path.join(__dirname, '../javascript')));

// ✅ Optional: Redirect root to login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/login.html'));
});

// ✅ Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ✅ Connect to MongoDB Atlas
console.log("Connecting to MongoDB Atlas...");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
})
.catch(err => console.error('❌ MongoDB Atlas connection error:', err));
