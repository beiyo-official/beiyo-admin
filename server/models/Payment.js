// models/Payment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Resident', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], required: true },
  month: { type: String, required: true },
  datePaid: { type: Date, default: Date.now },
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
