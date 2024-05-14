// routes/inventoryRoutes.js

const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single inventory item
router.get('/:id', getInventory, (req, res) => {
  res.json(res.inventory);
});

// Create a new inventory item
router.post('/', async (req, res) => {
  const inventory = new Inventory({
    hostelId: req.body.hostelId,
    itemName: req.body.itemName,
    quantity: req.body.quantity,
  });

  try {
    const newInventory = await inventory.save();
    res.status(201).json(newInventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an inventory item
router.patch('/:id', getInventory, async (req, res) => {
  if (req.body.itemName != null) {
    res.inventory.itemName = req.body.itemName;
  }
  if (req.body.quantity != null) {
    res.inventory.quantity = req.body.quantity;
  }
  try {
    const updatedInventory = await res.inventory.save();
    res.json(updatedInventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an inventory item
router.delete('/:id', getInventory, async (req, res) => {
  try {
    await res.inventory.remove();
    res.json({ message: 'Inventory item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get inventory item by ID
async function getInventory(req, res, next) {
  let inventory;
  try {
    inventory = await Inventory.findById(req.params.id);
    if (inventory == null) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.inventory = inventory;
  next();
}

module.exports = router;
