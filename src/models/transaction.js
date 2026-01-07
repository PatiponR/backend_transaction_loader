const mongoose = require('mongoose');
const crypto = require('crypto');

const transactionSchema = new mongoose.Schema({
    machineId: {
        type: String,
        required: true,
        trim: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        default: () => `${crypto.randomUUID()}-${Date.now()}`
    },
    transactionAmount: {
        type: Number, //can only be 1 or 0 (active, inactive)
        required: true
    },
    transactionDate: {
        type: Date,
        required: false,
        default: Date.now
    },
    transactionTime: {
        type: String,
        required: false,
        default: () => new Date().toLocaleTimeString()
    },
    transactionNotes: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Transaction', transactionSchema);
