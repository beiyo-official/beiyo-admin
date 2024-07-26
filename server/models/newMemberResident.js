// Resident model (resident.js)
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const residentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: Number, required: true },
  address: { type: String,
    //  required: true 
    },
    amount:{type:String},
  parentsName: { type: String, 
    // required: true 
  },
  parentsMobileNo: { type: Number, 
    // required: true 
  },
  hostel: { type: String, required: true },
  roomNumber: { type: String, required: true },
  dateJoined:{type:Date},
  password: { type: String, required: true },
  cash:{type:Boolean,default:false},
  // photo: String,
  // aadharCard: String,
  // signedDocuments:String,
  // intitutionDetails:String,
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
  contract: { type: Date },
  amount:{type:String}
  

  // other fields
});
residentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
module.exports = mongoose.model('Resident', residentSchema);
