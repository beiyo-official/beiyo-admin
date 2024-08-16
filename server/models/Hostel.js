// models/Hostel.js

const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: false },
  // remainingBeds:{type:Number,required:true}
  totalRemainingBeds:{type:Number,},
  locationLink:{type:String},
  price: {
    type: String,
},
image: {
    type: String, // Store image data as binary
},
image2:{
    type: String,
},
image3:{
    type:   String,
},
single:{
  type: Boolean,
},
singlePrice:{
  type:String,
},
doubleprice:{
  type:String,
},
tripleprice:{
  type:String,
},
nearby1:{
  type:String,
},
nearby2:{
  type:String,
},
nearby3:{
  type:String,
},
totalTenants:{
  type:Number,
},
totalTickets:{
  type:Number,
},
totalRooms:{
  type:Number
},
totalBeds:{
  type:Number
},
managerTickets:[{ type: mongoose.Schema.Types.ObjectId, ref: 'ticket'}],
adminTickets:[{ type: mongoose.Schema.Types.ObjectId, ref: 'ticket'}]



  // Add more fields as needed
});

const Hostel = mongoose.model('Hostel', hostelSchema);

module.exports = Hostel;
