require('dotenv').config(); // MUST BE LINE 1
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. Import all routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes'); // New route for items

const app = express();

// Middleware
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cors());

// 2. Use the routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes); // Handles all lost/found logic

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));