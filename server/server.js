require('dotenv').config(); // MUST BE LINE 1
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Fixed: Cleanly grouped at the top

// 1. Import all routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes'); // New route for items

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Fixed: Made the uploads folder use an absolute path so images load on Render
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Use the routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes); // Handles all lost/found logic

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // 1. Serve the compiled static frontend build files
  app.use(express.static(path.join(__dirname, '../client/build')));

  // 2. Use a custom middleware function to handle fallback routing cleanly
  app.use((req, res, next) => {
    // If a request accidentally slips through to a missing /api route, send a 404
    if (req.url.startsWith('/api/')) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    
    // For all regular UI navigation routes, serve your React frontend app
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));