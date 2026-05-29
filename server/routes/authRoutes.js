const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item'); 
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Normalize email and password to remove accidental spaces/caps
        const cleanEmail = email.toLowerCase().trim();
        const cleanPassword = password.trim();

        console.log(`Log: Attempting login for ${cleanEmail}`);

        const user = await User.findOne({ email: cleanEmail });

        if (!user) {
            console.log("Log: User not found in DB");
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // 2. Strict plain text comparison
        if (user.password !== cleanPassword) {
            console.log("Log: Password mismatch");
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // 3. Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        console.log("Log: Login successful");
        res.json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email } 
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
    try {
        const { name, password } = req.body;
        
        // Normalize data before saving
        const cleanEmail = req.body.email.toLowerCase().trim();
        const cleanPassword = password.trim();

        // Check if user already exists
        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ 
            name, 
            email: cleanEmail, 
            password: cleanPassword 
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Registration failed" });
    }
});

// --- PROFILE ROUTE ---
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const items = await Item.find({ reportedBy: req.user.id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user, items });
    } catch (err) {
        console.error("Profile error:", err);
        res.status(500).json({ message: "Server error fetching profile" });
    }
});

module.exports = router;