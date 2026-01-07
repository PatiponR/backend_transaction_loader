const mongoose = require('mongoose');

const machineProfileSchema = new mongoose.Schema({
    machineId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    modbusPort: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    }
})

module.exports = mongoose.model('MachineProfile', machineProfileSchema);
