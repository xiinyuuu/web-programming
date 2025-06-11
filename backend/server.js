console.log("🚀 Starting server.js...");

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

console.log("Connecting to MongoDB Atlas...");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
})
.catch(err => console.error('❌ MongoDB Atlas connection error:', err));
