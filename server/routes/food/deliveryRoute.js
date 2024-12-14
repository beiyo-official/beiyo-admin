const express = require('express');
const Delivery = require('./models/Delivery'); // Adjust path as needed
const Subscription = require('./models/Subscription');
const User = require('./models/User');

const router = express.Router();

// Create a new delivery entry
router.post('/', async (req, res) => {
  try {
    const { subscription, user, deliveryDate, meals, notes } = req.body;

    // Ensure the subscription exists
    const subscriptionExists = await Subscription.findById(subscription);
    if (!subscriptionExists) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Validate user
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newDelivery = new Delivery({
      subscription,
      user,
      deliveryDate,
      meals,
      notes,
    });

    await newDelivery.save();
    res.status(201).json({ message: 'Delivery created successfully', delivery: newDelivery });
  } catch (error) {
    res.status(500).json({ message: 'Error creating delivery', error: error.message });
  }
});

// Get all deliveries
router.get('/', async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate('subscription', 'status startDate endDate')
      .populate('user', 'name email');

    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deliveries', error: error.message });
  }
});

// Get deliveries for a specific subscription
router.get('/subscription/:subscriptionId', async (req, res) => {
  try {
    const deliveries = await Delivery.find({ subscription: req.params.subscriptionId })
      .populate('subscription', 'status startDate endDate')
      .populate('user', 'name email');

    if (!deliveries.length) {
      return res.status(404).json({ message: 'No deliveries found for this subscription' });
    }

    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deliveries for subscription', error: error.message });
  }
});

// Get deliveries for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const deliveries = await Delivery.find({ user: req.params.userId })
      .populate('subscription', 'status startDate endDate')
      .populate('user', 'name email');

    if (!deliveries.length) {
      return res.status(404).json({ message: 'No deliveries found for this user' });
    }

    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deliveries for user', error: error.message });
  }
});

// Update a delivery status
router.patch('/:id/status', async (req, res) => {
  try {
    const { meals } = req.body;

    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { meals },
      { new: true, runValidators: true }
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json({ message: 'Delivery status updated successfully', delivery: updatedDelivery });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery status', error: error.message });
  }
});

// Add or update notes for a delivery
router.patch('/:id/notes', async (req, res) => {
  try {
    const { notes } = req.body;

    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { notes },
      { new: true, runValidators: true }
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json({ message: 'Delivery notes updated successfully', delivery: updatedDelivery });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery notes', error: error.message });
  }
});

// Delete a delivery by ID
router.delete('/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting delivery', error: error.message });
  }
});

module.exports = router;
