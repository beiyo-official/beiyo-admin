const express = require('express');
const mongoose = require('mongoose');
const MealSelection = require('./models/MealSelection'); // Assuming the schema file is named "MealSelection.js"
const Resident = require('../../models/newMemberResident');

const router = express.Router();

// Create a new meal selection
router.post('/:userId', async (req, res) => {
  try {
    const {  date, meals, skipped } = req.body;

    // Ensure the user exists
    const userExists = await Resident.findById(req.params.userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if a meal selection for the same user and date already exists
    const existingSelection = await MealSelection.findOne({ user, date });
    if (existingSelection) {
      return res.status(400).json({ message: 'Meal selection for this date already exists' });
    }

    const newMealSelection = new MealSelection({ user, date, meals, skipped });
    await newMealSelection.save();

    res.status(201).json({ message: 'Meal selection created successfully', mealSelection: newMealSelection });
  } catch (error) {
    res.status(500).json({ message: 'Error creating meal selection', error: error.message });
  }
});

// Get all meal selections
router.get('/', async (req, res) => {
  try {
    const mealSelections = await MealSelection.find().populate('user', 'name email'); // Populate user details

    res.status(200).json(mealSelections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meal selections', error: error.message });
  }
});

// Get a specific meal selection by ID
router.get('/:id', async (req, res) => {
  try {
    const mealSelection = await MealSelection.findById(req.params.id).populate('user', 'name email');

    if (!mealSelection) {
      return res.status(404).json({ message: 'Meal selection not found' });
    }

    res.status(200).json(mealSelection);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meal selection', error: error.message });
  }
});

// Get meal selections for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const mealSelections = await MealSelection.find({ user: req.params.userId }).populate('user', 'name email');

    if (!mealSelections.length) {
      return res.status(404).json({ message: 'No meal selections found for this user' });
    }

    res.status(200).json(mealSelections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meal selections for user', error: error.message });
  }
});

// Update a meal selection by ID
router.put('/:id', async (req, res) => {
  try {
    const { meals, skipped } = req.body;

    const updatedMealSelection = await MealSelection.findByIdAndUpdate(
      req.params.id,
      { meals, skipped },
      { new: true, runValidators: true }
    );

    if (!updatedMealSelection) {
      return res.status(404).json({ message: 'Meal selection not found' });
    }

    res.status(200).json({ message: 'Meal selection updated successfully', mealSelection: updatedMealSelection });
  } catch (error) {
    res.status(500).json({ message: 'Error updating meal selection', error: error.message });
  }
});

// Delete a meal selection by ID
router.delete('/:id', async (req, res) => {
  try {
    const mealSelection = await MealSelection.findByIdAndDelete(req.params.id);

    if (!mealSelection) {
      return res.status(404).json({ message: 'Meal selection not found' });
    }

    res.status(200).json({ message: 'Meal selection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting meal selection', error: error.message });
  }
});

// Get meal selections for a specific date
router.get('/date/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const mealSelections = await MealSelection.find({ date }).populate('user', 'name email');

    if (!mealSelections.length) {
      return res.status(404).json({ message: 'No meal selections found for this date' });
    }

    res.status(200).json(mealSelections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meal selections for date', error: error.message });
  }
});

module.exports = router;
