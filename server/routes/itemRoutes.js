const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const multer = require('multer');
const path = require('path');

// 1. Setup Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// 2. The POST Route
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { title, description, location, status, reportedBy } = req.body;
        
        const newItem = new Item({
            title,
            description,
            location,
            status,
            image: req.file ? req.file.filename : '',
            reportedBy 
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// 3. GET All Items (For Global Dashboard)
router.get('/', async (req, res) => {
    try {
        const items = await Item.find()
            .sort({ createdAt: -1 })
            .populate('reportedBy', 'name email'); 
            
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ 4. NEW: GET items for a specific user (For "My Reports" Page)
router.get('/user/:userId', async (req, res) => {
    try {
        const items = await Item.find({ reportedBy: req.params.userId })
            .sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ 5. NEW: DELETE an item
router.delete('/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ 6. NEW: Mark an item as Resolved
router.patch('/:id/resolve', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { status: 'Resolved' },
            { new: true }
        );
        
        if (!updatedItem) return res.status(404).json({ message: "Item not found" });
        
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;