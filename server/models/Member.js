const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const memberSchema = new Schema({
  name: { type: String, required: true },
  email:{ type: String, required: true},
  post: { type: String, required: true },
  uniqueId: {type: String, required: true},
  mobileNumber: { type: Number,  
  },
  password:{
    type:String
  }
  // address: { type: String,
  //   },


 
  // imageUrl:{type:String},
  // aadhaarCardUrl: {type:String},

});
memberSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
const Member = mongoose.model('Member', memberSchema);

module.exports = Member;


