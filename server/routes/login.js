const express = require('express');
const router = express.Router();
const Resident = require('../models/newMemberResident');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const genrateOTP = require('../functions/generatingOTP');

const otps = {};

// Login Route
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Resident.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET , { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.cookie('user', user, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.json({ token, user });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

// Verify OTP and reset password
router.post('/resetPassword', async (req, res) => {
  const { email, otp } = req.body;
  const userOtp = otps[email];

  // Check if OTP is valid and not expired
  if (!userOtp || userOtp.otp !== otp || userOtp.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP'  });
  }

  try {
    res.json({ message: 'OTP is verified' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'OTP is invalid' });
  }
});

router.post('/updatePassword',async(req,res)=>{
  const {email,newPassword}=req.body
  try {
    const user = await Resident.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error resetting password' });
  }
})

router.post('/forgetPassword', async (req, res) => {
  const { email } = req.body;
  const otp = genrateOTP();
  // Generate a 6-digit OTP
  try {
    const user = await Resident.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    // Save OTP in memory with an expiration time (e.g., 10 minutes)
    otps[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

    // Send OTP via email
    await sendUniqueIdEmail(email, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});


module.exports = router;

const sendUniqueIdEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'support@beiyo.in', // Replace with your Gmail address
      pass: process.env.EMAIL_PASSWORD, // Replace with your app-specific password or use environment variable
    },
  });

  const mailOptions = {
    from: 'support@beiyo.in',
    to: email,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP for resetting your password is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

