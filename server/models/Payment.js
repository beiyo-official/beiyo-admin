// models/Payment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Resident', required: true },
  userName:{type:String,required: true},
  amount: { type: Number, required: true },
  status: { type: String, enum: ['due', 'successful'], required: true },
  rent:{type:Number},
  month: { type: String, required: true },
  date: { type: Date, default: Date.now },
  cash: { type: Boolean,default:false},
  additionalCharge:{type: Number, default:0},
  type:{type:String,enum:['rent','dueCharge'], default:'rent' }
  // totalAmount:{type:Number}
}, {
  timestamps: true
});



module.exports = mongoose.model('Payment', paymentSchema);
