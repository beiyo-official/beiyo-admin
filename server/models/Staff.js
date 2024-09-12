const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  mobileNumber: { type: Number,  
  },
  address: { type: String,
    },
  nearOneName: { type: String, 
  },
  nearOneMobileNo: { type: Number, 
  },
  dateJoined:{type:Date},      
  contractEndDate: { type: Date },
  contractTerms:{type:Number},
  area: { type: String }, 
  imageUrl:{type:String},
  aadhaarCardUrl: {type:String},
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;


