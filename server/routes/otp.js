const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const newMemberResident = require('../models/newMemberResident');

router.post('/send',async(req,res)=>{
    const {email} = req.body;
    const resident = await newMemberResident.find(email)
    if(resident){
      res.status(400).json("Email already exist");
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    await sendUniqueIdEmail(email,otp);
    res.json(otp);
})

const sendUniqueIdEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net', // For GoDaddy cPanel email
  port: 465, // or 587 for TLS
  secure: true, // Use true for port 465, false for other ports
  auth: {
    user: 'support@beiyo.in', // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
    });
  
    const mailOptions = {
      from: 'support@beiyo.in',
      to: email,
      subject: 'Your email verify OTP',
      text: `Your OTP is ${otp}`,
    };
  
    await transporter.sendMail(mailOptions);
  };

  module.exports = router;