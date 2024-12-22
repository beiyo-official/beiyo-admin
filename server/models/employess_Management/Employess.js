const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['Cleaner', 'Manager', 'Emergency Responder', 'Admin'], required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // References Task model
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    hostels:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Hostel'}]
});

module.exports = mongoose.model('Employee', EmployeeSchema);