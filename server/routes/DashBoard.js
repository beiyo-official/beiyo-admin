// routes/api.js
const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
// const StayDetails = require('../models/StayDetails');
const Resident = require('../models/newMemberResident');
// const HelpTopic = require('../models/HelpTopic');
const Ticket = require('../models/ticket');
const authMiddleware = require('../middleware/middleware');

// Get user payments
router.get('/payments', authMiddleware, async (req, res) => {
  try {
    const userId = req.user; // Extracted from auth middleware
    const payments = await Payment.find({ userId });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve payments' });
  }
});


// Get user stay details
router.get('/stay-details', authMiddleware, async (req, res) => {
  try {
    const userId = req.user; // Extracted from auth middleware
    const details = await Resident.findById( userId );
    if (!details) {
      return res.status(404).json({ message: 'Stay details not found' });
    }
    res.json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve stay details' });
  }
});

// Raise a support ticket
router.post('/raise-ticket', authMiddleware, async (req, res) => {
  try {
    const userId = req.user; // Extracted from auth middleware
    const userDetails = await Resident.findById(userId);
    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }
    const name = userDetails.name;
    const hostel = userDetails.hostel;
    const room = userDetails.roomNumber;
    const { helpTopic, description } = req.body;

    if (!helpTopic || !description) {
      return res.status(400).json({ message: 'Help topic and description are required' });
    }

    const ticket = new Ticket({name, userId, hostel, room, helpTopic, description });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to raise a support ticket' });
  }
});

module.exports = router;
