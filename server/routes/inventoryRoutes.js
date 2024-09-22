// routes/inventoryRoutes.js

const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Item = require('../models/item');
// Get all inventory items
router.post('hostels/:hostelId', async (req, res) => {
  try {
    const { name, category, quantity, pricePerQuantity, totalPrice, description, warrantyUpto, warrantyDate, purchaseDate } = req.body;
    const hostelId = req.params.hostelId;

    // Create a new item
    const item = new Item({
      name,
      category,
      quantity,
      pricePerQuantity,
      totalPrice,
      description,
      warrantyUpto,
      warrantyDate,
      purchaseDate  
    });
    await item.save();

    // Find or create inventory for the hostel
    let inventory = await Inventory.findOne({ hostelId });
    if (!inventory) {
      inventory = new Inventory({
        hostelId,
        items: [item._id],
        owner: false, // or set it based on your logic
      });
    } else {
      inventory.items.push(item._id);
    }

    await inventory.save();
    res.status(201).json({ inventory, item });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all items in a hostel's inventory
router.get('hostels/:hostelId', async (req, res) => {
  try {
    const hostelId = req.params.hostelId;
    const inventory = await Inventory.findOne({ hostelId }).populate('items');
    
    if (!inventory) {
      return res.status(404).json({ message: 'No inventory found for this hostel' });
    }
    
    res.status(200).json(inventory.items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an item's details in the inventory
router.put('hostels/:hostelId/:itemId', async (req, res) => {
  try {
    const { quantity, pricePerQuantity, totalPrice, description, warrantyUpto, warrantyDate, purchaseDate } = req.body;
    const itemId = req.params.itemId;

    // Update item details
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { quantity, pricePerQuantity, totalPrice, description, warrantyUpto, warrantyDate, purchaseDate },  // Add purchaseDate
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Delete an item from the inventory
router.delete('/hostels/:hostelId/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const hostelId = req.params.hostelId;

    // Remove item from inventory
    const inventory = await Inventory.findOne({ hostelId });
    if (!inventory) {
      return res.status(404).json({ message: 'No inventory found for this hostel' });
    }

    // Remove item from items array and delete the item document
    inventory.items.pull(itemId);
    await inventory.save();
    await Item.findByIdAndDelete(itemId);

    res.status(200).json({ message: 'Item removed from inventory' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});






module.exports = router;
