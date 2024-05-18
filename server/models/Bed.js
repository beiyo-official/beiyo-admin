// models/Bed.js

const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  isEmpty: { type: Boolean, default: true },
  charge: { type: Number, required: true },
  availableFrom: { type: Date, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  duration: { type: String, required: true }, // e.g., 'monthly', 'weekly'
  dueDate: { type: Date, required: true },
  // Add other fields as needed
});

const Bed = mongoose.model('Bed', bedSchema);

module.exports = Bed;
