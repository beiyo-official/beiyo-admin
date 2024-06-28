// Resident model (resident.js)
const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: Number, required: true },
  address: { type: String, required: true },
  parentsName: { type: String, required: true },
  parentsMobileNo: { type: Number, required: true },
  hostel: { type: String, required: true },
  roomNumber: { type: String, required: true },
  // photo: String,
  // aadharCard: String,
  // signedDocuments:String,
  // intitutionDetails:String,
  // payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
  // contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }
  
  

  // other fields
});

module.exports = mongoose.model('Resident', residentSchema);
