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
const totalTickets = require('../functions/TotalTickets');


// Fetch payments for a user
router.get('/payments/:userId', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId }).sort({ month: 1 });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/payments',async(req,res)=>{
  try {
    const payments= await Payment.find();
    res.json(payments); 
  } catch (error) {
    console.log(error);
  }
})

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

router.get('/payment/user/:id', async (req, res) => {
  try {
    const paymentId = req.params.id;
    const resident = await Resident.find({
      payments: paymentId
    });
    
    res.json(resident);
 
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/paymentSave', async (req, res) => {
  try {
    const { userId, month, amount } = req.body;
    // const payment = await Payment.findOneAndUpdate(
    //   { userId, month },
    //   { status: 'successful', amount, date: new Date() },
    //   { new: true }
    //   );
    // res.status(201).json(payment);
    
  const cash = false;
   await paymentSave(userId,month,amount,cash);
    res.json('successfully saved');
  } catch (error) {
    console.error('Error making payment:', error);
    res.status(500).send('Internal Server Error');
  }
});
const paymentSave = async (userId,month,amount,cash)=>{
  const payment = await Payment.findOneAndUpdate(
    { userId, month },
    { status: 'successful', amount,cash:cash },
    { new: true, },
    );
    return payment
}

router.post('/cashPayments',async(req,res)=>{
  try {
    const { email,month,amount } = req.body;
    const formatMonth = dayjs(month).startOf('month');
    const monthFormated = formatMonth.format('YYYY-MM');
    const cash = true;

    const resident = await Resident.findOne({email});
    if(!resident){
      return res.status(404).json({message:'Resident not found'});
    }
    paymentSave(resident.id,monthFormated,amount,cash)
    res.json({message:'successfull through cash'});
  } catch (error) {
    console.error('Error making payment:', error);
    res.status(500).send('Internal Server Error');
  }

})




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
router.post('/raise-ticket', async (req, res) => {
  try {

    const { helpTopic, description, userId } = req.body;
    const userDetails = await Resident.findById(userId);
    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }
    const name = userDetails.name;
    const hostel = userDetails.hostel;
    const hostelId = userDetails.hostelId;
    const room = userDetails.roomNumber;
   

    if (!helpTopic || !description) {
      return res.status(400).json({ message: 'Help topic and description are required' });
    }

    const ticket = new Ticket({name, userId, hostel, room, helpTopic, description,hostelId });
    await ticket.save();
   await totalTickets(userDetails.hostelId);
    res.status(201).json(ticket);
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to raise a support ticket' });
  }
});
router.get('/oldTickets/:userid',async(req,res)=>{
  try {
    const userId = req.params.userid;
    const tickets = await Ticket.find({userId}).sort({createdAt:-1});
    res.json(tickets);
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;


