const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        // ✅ UPDATED: Added 'Resolved' to the enum array
        enum: ['Lost', 'Found', 'Resolved'], 
        default: 'Lost' 
    },
    image: { 
        type: String,
        default: '' 
    },
    reportedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);