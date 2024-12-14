const express = require('express');
const mongoose = require('mongoose');
const Basement = require('./models/Basement'); // Assuming the schema file is named "Basement.js"

const router = express.Router();

// Create a new basement
router.post('/', async (req, res) => {
  try {
    const { name, address, subscriptions, weeklyMenus } = req.body;

    const basement = new Basement({ name, address, subscriptions, weeklyMenus });
    await basement.save();

    res.status(201).json({ message: 'Basement created successfully', basement });
  } catch (error) {
    res.status(500).json({ message: 'Error creating basement', error: error.message });
  }
});

// Get all basements
router.get('/', async (req, res) => {
  try {
    const basements = await Basement.find()
      .populate('subscriptions') // Populate related subscriptions
      .populate('weeklyMenus');  // Populate related menus

    res.status(200).json(basements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching basements', error: error.message });
  }
});

// Get a specific basement by ID
router.get('/:id', async (req, res) => {
  try {
    const basement = await Basement.findById(req.params.id)
      .populate('subscriptions')
      .populate('weeklyMenus');

    if (!basement) {
      return res.status(404).json({ message: 'Basement not found' });
    }

    res.status(200).json(basement);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching basement', error: error.message });
  }
});

// Update a basement by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, address, subscriptions, weeklyMenus } = req.body;

    const basement = await Basement.findByIdAndUpdate(
      req.params.id,
      { name, address, subscriptions, weeklyMenus },
      { new: true, runValidators: true }
    );

    if (!basement) {
      return res.status(404).json({ message: 'Basement not found' });
    }

    res.status(200).json({ message: 'Basement updated successfully', basement });
  } catch (error) {
    res.status(500).json({ message: 'Error updating basement', error: error.message });
  }
});

// Delete a basement by ID
router.delete('/:id', async (req, res) => {
  try {
    const basement = await Basement.findByIdAndDelete(req.params.id);

    if (!basement) {
      return res.status(404).json({ message: 'Basement not found' });
    }

    res.status(200).json({ message: 'Basement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting basement', error: error.message });
  }
});

// Add a subscription to a basement
router.post('/:id/subscriptions', async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    const basement = await Basement.findById(req.params.id);

    if (!basement) {
      return res.status(404).json({ message: 'Basement not found' });
    }

    basement.subscriptions.push(subscriptionId);
    await basement.save();

    res.status(200).json({ message: 'Subscription added successfully', basement });
  } catch (error) {
    res.status(500).json({ message: 'Error adding subscription', error: error.message });
  }
});

// Remove a subscription from a basement
router.delete('/:id/subscriptions/:subscriptionId', async (req, res) => {
  try {
    const basement = await Basement.findById(req.params.id);

    if (!basement) {
      return res.status(404).json({ message: 'Basement not found' });
    }

    basement.subscriptions.pull(req.params.subscriptionId);
    await basement.save();

    res.status(200).json({ message: 'Subscription removed successfully', basement });
  } catch (error) {
    res.status(500).json({ message: 'Error removing subscription', error: error.message });
  }
});

// Add a menu to a basement
router.post('/:id/menus', async (req, res) => {
  try {
    const { menuId } = req.body;

    const basement = await Basement.findById(req.params.id);

    if (!basement) {
      return res.status(404).json({ message: 'Basement not found' });
    }

    basement.weeklyMenus.push(menuId);
    await basement.save();

    res.status(200).json({ message: 'Menu added successfully', basement });
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu', error: error.message });
  }
});

// Remove a menu from a basement
router.delete('/:id/menus/:menuId', async (req, res) => {
  try {
    const basement = await Basement.findById(req.params.id);

    if (!basement) {
      return res.status(404).json({ message: 'Basement not found' });
    }

    basement.weeklyMenus.pull(req.params.menuId);
    await basement.save();

    res.status(200).json({ message: 'Menu removed successfully', basement });
  } catch (error) {
    res.status(500).json({ message: 'Error removing menu', error: error.message });
  }
});

module.exports = router;
