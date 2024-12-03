const express = require('express');
const router = express.Router();
const Resident = require('../models/newMemberResident');
const nodemailer = require('nodemailer');
router.get('/rent', async (req, res) => {
  try {
    // Find current residents and populate payments
    const residents = await Resident.find({ living: "current" }).populate('payments');
    

    // Track email sending results
    const emailResults = [];

    // Send unique ID emails to each resident
    for (const resident of residents) {
      try {
        // Check if rent is already paid for the month
        const isPaid = resident.payments.some(payment => 
        payment.type="rent" && payment.month === req.body.month && payment.status === "successful"
        );

        if (!isPaid) {
          // Send unique payment ID email
          const uniquePaymentId = await sendUniqueIdEmail(resident);
          
          emailResults.push({
            residentId: resident._id,
            email: resident.email,
            status: 'sent',
            uniquePaymentId: uniquePaymentId
          });
        } else {
          emailResults.push({
            residentId: resident._id,
            email: resident.email,
            status: 'skipped',
            reason: 'Rent already paid'
          });
        }
      } catch (residentError) {
        emailResults.push({
          residentId: resident._id,
          email: resident.email,
          status: 'failed',
          error: residentError.message
        });
      }
    }

    // Respond with email sending results
    res.status(200).json({
      message: 'Rent reminder process completed',
      results: emailResults
    });
  } catch (error) {
    console.error('Rent reminder route error:', error);
    res.status(500).json({ 
      message: 'Failed to process rent reminders', 
      error: error.message 
    });
  }
});

const sendUniqueIdEmail = async (resident) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'support@beiyo.in', // Replace with your Gmail address
      pass: process.env.EMAIL_PASSWORD, // Replace with your app-specific password or use environment variable
    },
  });

  const mailOptions = {
    from: 'support@beiyo.in',
    to: resident.email,
    subject: 'Rent Payment Reminder',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Rent Payment Reminder</h2>
      <p>Dear ${resident.name},</p>
      <p>This is a reminder for your current rent payment.</p>
      
      <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
        <h3>Payment Details:</h3>
        <p><strong>Amount Due:</strong> Rs. ${resident.rent}</p>
        <p><strong>Login:</strong> beiyo.in/login </p>
      </div>
      <p>If you have any questions, please contact management.</p>
      
      <p>Best regards,<br>BEIYO</p>
    </div>
  `
    
  };

  await transporter.sendMail(mailOptions);
};

  module.exports = router;
  