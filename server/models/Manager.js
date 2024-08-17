// Resident model (resident.js)
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const managerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: Number, required: true },
  personalAddress: { type: String,
    //  required: true 
    },
hostels:[{type : mongoose.Schema.Types.ObjectId, ref:'Hostel'}],
  password: { type: String, required: true },
  photo: String,
  aadhaarCardUrl: String,

  // other fields
});
managerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
module.exports = mongoose.model('Manager', managerSchema);