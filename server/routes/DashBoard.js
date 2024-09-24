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

const Hostels = require('../models/Hostel');
const filterPaymentsByCurrentMonth = require('../functions/filterCurrentmonthPayments');
const rentMapAmount = require('../functions/paymentfunction');
// const { totalPendingTickets, totalTickets } = require('../functions/TotalTickets');




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
// update amount 
router.put('/updateAmount/:userId', async (req, res) => {
  try {
    const payments = await Payment.updateMany(  { userId: req.params.userId },  // Match all payments for this user
      { 
        rent: req.body.rent,
        amount: req.body.amount 
      });
      if (payments.matchedCount === 0) {
        return res.status(404).send('No payments found for this user');
      }
      res.json(payments);
  } catch (error) {
    res.json(error);
  }
})

router.put('/updateSuccesfulPaymentStatus/:userId',async(req,res)=>{
  try {
    const payments = await Payment.updateMany(  { userId: req.params.userId },  // Match all payments for this user
      { 
       status:"due",
       cash:false
      });
      if (payments.matchedCount === 0) {
        return res.status(404).send('No payments found for this user');
      }
      res.json(payments);
  } catch (error) {
    res.json(error);
  }
})


router.get('/payments',async(req,res)=>{
  try {
    const payments= await Payment.find();
    // await rentMapAmount();
    res.json(payments); 
  } catch (error) {
    console.log(error);
  }
})

router.get('/paymentsArray', async (req, res) => {
  try {
    // Get the list of resident IDs from the query parameter (assuming they are comma-separated)
    const paymentsIds = req.query.ids.split(',');

    // Find residents in the database whose IDs match the provided list
    const payments = await Payment.find({
      _id: { $in: paymentsIds }
    });

    // Return the list of residents
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching residents:', error);
    res.status(500).json({ error: 'Failed to fetch Payments' });
  }
});



router.delete('/deletePayment/:paymentId',async(req,res)=>{
  try {
    const paymentId = req.params.paymentId
    const payment = await Payment.findById(paymentId);
    if(!payment){
      return res.status(404).send('Payment not found');
    } 
    const resident = await Resident.findById(payment.userId);
    if(!resident){
      return res.status(404).send('Resident not found');
    }
    resident.payments.pull(paymentId);
    await resident.save();
    await payment.remove();
    await payment.save();
    res.json("payment deleted successfully")
  } catch (error) {
    console.log(error);
  }
})




// due payments
router.get('/duePayments',async(req,res)=>{
  try {
    const payments = await Payment.find({type:'dueCharge'});
    res.json(payments);
  } catch (error) {
    res.json(error);
  }
})
router.get('/updateDueAmount/:residentId',async(req,res)=>{
  try {
    const payment = await Payment.findOne({userId:req.params.residentId,type:'dueCharge'})
    res.json(payment);
  } catch (error) {
   res.json(error); 
  }
})


// update dueAmount
router.put('/updateDueAmount/:id',async(req,res)=>{
  try {
    const payment = await Payment.findAndUpdate(req.params.id,{
      amount:req.body.amount
    },{new:true});
    res.json(payment);
  } catch (error) {
    res.json(error);
  }
}
)
router.put('/resident/updateDueAmount/:residentId',async(req,res)=>{
  try {
    const payment = await Payment.findOneAndUpdate({userId:req.params.residentId,type:'dueCharge'},{amount:req.body.amount},{new:true})
    res.json(payment);

  } catch (error) {
   res.json(error); 
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

// current month payment
router.get('/payment/currentmonth',async(req,res)=>{
  try {
       // Get the current date

       const currentDate = new Date();
       const date = dayjs(currentDate).startOf('month');
       const month = date.format('YYYY-MM');
       console.log(month);
   
     
   
       // Find payments where `date` is within the current month
       const payments = await Payment.find({
        month:month
       });
       res.json(payments);

  } catch (error) {
    res.status(500).json(error);
  }
})






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

router.put('/cashPayment/:id',async(req,res)=>{
  try {
      const paymentId = req.params.id
      const payment = await Payment.findByIdAndUpdate(paymentId,{
        cash:true,status:'successful'
      },{new:true})
    res.json({message:'successful through cash'});
  } catch (error) {
    console.error('Error making payment:', error);
    res.status(500).send('Internal Server Error');
  }

})
router.get('/currentMonthPayments/:hostelId',async(req,res)=>{
  try {
    // Step 1: Find users by hostelId and populate their payments
    const Residents = await Resident.find({ hostelId: req.params.hostelId }).populate('payments');

    // Step 2: Filter payments for each user to include only payments from the current month
    const usersWithCurrentMonthPayments = Residents.map(user => {
        const currentMonthPayments = filterPaymentsByCurrentMonth(user.payments);
      return currentMonthPayments
    });

    // Step 3: Send the filtered users and their current month payments as a response
    res.json(usersWithCurrentMonthPayments);

} catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error' });
}
})


router.get('/monthPayments/:hostelId',async(req,res)=>{
  try {
    // Step 1: Find users by hostelId and populate their payments
    const Residents = await Resident.find({ hostelId: req.params.hostelId }).populate('payments');


  const userPayments = Residents.map(user=>{
    return user.payments;
  })
  res.json(userPayments);
    // Step 3: Send the filtered users and their current month payments as a response
   

} catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error' });
}
})

router.get('/monthPayments/:hostelId/:month', async (req, res) => {
  try {
    const { hostelId, month } = req.params;

    // Find residents by hostelId and populate their payments
    const residents = await Resident.find({ hostelId,living:'current' })
      .populate({
        path: 'payments',
        match: { month }  // Filter payments by month
      });

    // Extract payments from residents
    const userPayments = residents.flatMap(resident => resident.payments);

    res.json(userPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error' });
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
      const totalTickets = await Ticket.countDocuments({hostelId:hostelId});
       await Hostels.findByIdAndUpdate(hostelId,{totalTickets:totalTickets},{new:true});
       const totalPendingTickets = await Ticket.countDocuments({hostelId:hostelId},{status:'Open'});
       await Hostels.findByIdAndUpdate(hostelId,{totalPendingTickets:totalPendingTickets},{new:true});



   const Hostel = await Hostels.findById(hostelId);
    Hostel.managerTickets.push(ticket.id); 
    await Hostel.save();
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


