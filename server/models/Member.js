const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  name: { type: String, required: true },
  email:{ type: String, required: true},
  post: { type: String, required: true },
  uniqueId: {type: String, required: true},
  mobileNumber: { type: Number,  
  },
  address: { type: String,
    }, 
  imageUrl:{type:String},
  aadhaarCardUrl: {type:String},
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;


