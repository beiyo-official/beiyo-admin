// models/Inventory.js

const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  items:[{type:mongoose.Schema.Types.ObjectId,ref:'Item',required:true}],
  owener:{type:Boolean,default:false}
  // Add more fields as needed
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;

