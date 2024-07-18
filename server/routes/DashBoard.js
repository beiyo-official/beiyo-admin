// routes/api.js
const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
// const StayDetails = require('../models/StayDetails');
const Resident = require('../models/newMemberResident');
// const HelpTopic = require('../models/HelpTopic');
const Ticket = require('../models/ticket');
const authMiddleware = require('../middleware/middleware');
const dayjs = require('dayjs');


// Fetch payments for a user
router.get('/payments/:userId', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId }).sort({ month: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/payment/:id', async (req, res) => {
  try {
    const paymentId = req.params.id;
    console.log(paymentId);
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/paymentSave', async (req, res) => {
  try {
    const { userId, month, amount } = req.body;
    const payment = await Payment.findOneAndUpdate(
      { userId, month },
      { status: 'successful', amount, date: new Date() },
      { new: true }
    );
    res.status(201).json(payment);
  } catch (error) {
    console.error('Error making payment:', error);
    res.status(500).send('Internal Server Error');
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


