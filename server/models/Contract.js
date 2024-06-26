const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' },
  startDate: Date,
  endDate: Date,
  monthlyRate: Number
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
