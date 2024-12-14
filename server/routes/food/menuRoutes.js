const express = require('express');
const mongoose = require('mongoose');
const Basement = require('../../models/Food/Basement');
const Menu = require('../../models/Food/MenuSchema');


const router = express.Router();

// Create a new menu
router.post('/', async (req, res) => {
  try {
    const { week, menu, basement } = req.body;

    // Ensure the basement exists
    const basementExists = await Basement.findById(basement);
    if (!basementExists) {
      return res.status(404).json({ message: 'Associated basement not found' });
    }

    const newMenu = new Menu({ week, menu, basement });
    await newMenu.save();

    res.status(201).json({ message: 'Menu created successfully', menu: newMenu });
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu', error: error.message });
  }
});

// Get all menus
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find().populate('basement', 'name address'); // Populate basement details

    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menus', error: error.message });
  }
});

// Get a specific menu by ID
router.get('/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).populate('basement', 'name address');

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu', error: error.message });
  }
});

// Update a menu by ID
router.put('/:id', async (req, res) => {
  try {
    const { week, menu, basement } = req.body;

    if (basement) {
      const basementExists = await Basement.findById(basement);
      if (!basementExists) {
        return res.status(404).json({ message: 'Associated basement not found' });
      }
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      { week, menu, basement },
      { new: true, runValidators: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.status(200).json({ message: 'Menu updated successfully', menu: updatedMenu });
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu', error: error.message });
  }
});

// Delete a menu by ID
router.delete('/:id', async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.status(200).json({ message: 'Menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu', error: error.message });
  }
});

// Get menus by basement ID
router.get('/basement/:basementId', async (req, res) => {
  try {
    const menus = await Menu.find({ basement: req.params.basementId }).populate('basement', 'name address');

    if (!menus.length) {
      return res.status(404).json({ message: 'No menus found for this basement' });
    }

    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menus for basement', error: error.message });
  }
});

module.exports = router;
