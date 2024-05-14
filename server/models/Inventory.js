// models/Inventory.js

const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  // Add more fields as needed
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
