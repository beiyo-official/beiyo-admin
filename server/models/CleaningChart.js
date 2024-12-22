const mongoose = require('mongoose');

const CleaningChartSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  date: { type: String, required: true }, // Store date as string for easier querying
  roomNumber: { type: String, required: true },
  cleaned: { type: Boolean, default: false },
});

module.exports = mongoose.model('CleaningChart', CleaningChartSchema);
 