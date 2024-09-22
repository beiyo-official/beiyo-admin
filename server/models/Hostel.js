// models/Hostel.js

const mongoose = require('mongoose');


const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true ,index:true},
  location: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: false },
  // remainingBeds:{type:Number,required:true}
  totalRemainingBeds:{type:Number,index: true},
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
doublePrice:{
  type:String,
},
triplePrice:{
  type:String,
},
nearby1:{
  type:String,
},
nearby1distance:{
  type:String,
},
nearby2distance:{
  type:String,
},
nearby3distance:{
  type:String,
},
nearby2:{
  type:String,
},
nearby3:{
  type:String,
},
totalTenants:{
  type:Number,default:0
},
totalTickets:{
  type:Number,default:0
},
totalPendingTickets:{
  type:Number,default:0
},
totalClosedTickets:{
  type:Number,default:0
},
totalRooms:{
  type:Number,default:0
},
totalBeds:{
  type:Number, default:0
},
siteTotalRemainingBeds:{
  type:Number,default:0
},
managerTickets:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'}],
adminTickets:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'}],
residents:[{type: mongoose.Schema.Types.ObjectId, ref:'Resident'}],
hostelType:{
  type:String,enum:['Boys','Girls'],default:'Boys'
},

  // Add more fields as needed
});

const Hostel = mongoose.model('Hostel', hostelSchema);

module.exports = Hostel;
