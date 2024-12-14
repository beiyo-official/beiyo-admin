const express = require('express');
const mongoose = require('mongoose');
const Subscription = require('./models/Subscription'); // Assuming the schema file is named "Subscription.js"
const User = require('./models/User'); // To validate user association

const router = express.Router();

// Create a new subscription
router.post('/', async (req, res) => {
  try {
    const { user, startDate, endDate, mealPlan, skippedDays } = req.body;

    // Ensure the user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure startDate is before endDate
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    const newSubscription = new Subscription({
      user,
      startDate,
      endDate,
      mealPlan,
      skippedDays,
    });

    await newSubscription.save();
    res.status(201).json({ message: 'Subscription created successfully', subscription: newSubscription });
  } catch (error) {
    res.status(500).json({ message: 'Error creating subscription', error: error.message });
  }
});

// Get all subscriptions
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate('user', 'name email');

    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
  }
});

// Get a specific subscription by ID
router.get('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate('user', 'name email');

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription', error: error.message });
  }
});

// Get subscriptions for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.params.userId }).populate('user', 'name email');

    if (!subscriptions.length) {
      return res.status(404).json({ message: 'No subscriptions found for this user' });
    }

    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions for user', error: error.message });
  }
});

// Update a subscription by ID
router.put('/:id', async (req, res) => {
  try {
    const { startDate, endDate, status, mealPlan, skippedDays } = req.body;

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { startDate, endDate, status, mealPlan, skippedDays },
      { new: true, runValidators: true }
    );

    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.status(200).json({ message: 'Subscription updated successfully', subscription: updatedSubscription });
  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription', error: error.message });
  }
});

// Pause or cancel a subscription by ID
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'paused', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.status(200).json({ message: 'Subscription status updated successfully', subscription: updatedSubscription });
  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription status', error: error.message });
  }
});

// Add a skipped day to a subscription
router.patch('/:id/skippedDays', async (req, res) => {
  try {
    const { skippedDays } = req.body;

    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.skippedDays.push(...skippedDays);
    await subscription.save();

    res.status(200).json({ message: 'Skipped days added successfully', subscription });
  } catch (error) {
    res.status(500).json({ message: 'Error adding skipped days', error: error.message });
  }
});

// Remove a skipped day from a subscription
router.patch('/:id/removeSkippedDay', async (req, res) => {
  try {
    const { skippedDay } = req.body;

    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.skippedDays = subscription.skippedDays.filter(day => day.toISOString() !== new Date(skippedDay).toISOString());
    await subscription.save();

    res.status(200).json({ message: 'Skipped day removed successfully', subscription });
  } catch (error) {
    res.status(500).json({ message: 'Error removing skipped day', error: error.message });
  }
});

// Delete a subscription by ID
router.delete('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.status(200).json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subscription', error: error.message });
  }
});

module.exports = router;
