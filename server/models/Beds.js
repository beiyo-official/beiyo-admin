// models/Bed.js

const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  bedNumber:{type:String,},
  isEmpty: { type: Boolean, default: true },
  charge: { type: Number,  },
  availableFrom: { type: Date,},
  paymentStatus: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  duration: { type: String,  }, // e.g., 'monthly', 'weekly'
  dueDate: { type: Date,},
  // Add other fields as needed
});

const Beds = mongoose.model('Beds', bedSchema);

module.exports = Beds;
