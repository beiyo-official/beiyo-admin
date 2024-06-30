// models/StayDetails.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stayDetailsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hostel: { type: String, required: true },
  roomNumber: { type: String, required: true },
  dateJoined: { type: Date, required: true },
  contractStartDate: { type: Date, required: true }, // Start date of the contract
  contractEndDate: { type: Date, required: true },  
}, {
  timestamps: true
});

module.exports = mongoose.model('StayDetails', stayDetailsSchema);
