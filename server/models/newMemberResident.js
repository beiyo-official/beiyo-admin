// Resident model (resident.js)
const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobileNumber: Number,
  uniqueId: { type: String, unique: true },
  address:String,
  parentsName: String,
  parentsMobileNo: Number,
  hostel:String,
  roomNumber: String,
  photo: String,
  aadharCard: String,
  signedDocuments:String,
  intitutionDetails:String,
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }
  
  

  // other fields
});

module.exports = mongoose.model('Resident', residentSchema);
