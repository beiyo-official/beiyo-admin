const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' },
  amount: Number,
  date: Date,
  description: String
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
