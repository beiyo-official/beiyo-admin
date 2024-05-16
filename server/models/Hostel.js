// models/Hostel.js

const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  // roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  remainingBeds:{type:String,required:true}
  // Add more fields as needed
});

const Hostel = mongoose.model('Hostel', hostelSchema);

module.exports = Hostel;
