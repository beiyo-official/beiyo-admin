const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send',async(req,res)=>{
    const {email} = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    await sendUniqueIdEmail(email,otp);
    res.json(otp);
})

const sendUniqueIdEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'beiyofinancetech@gmail.com', // Your email
        pass: 'hetsusifwjvdldto', // Your email password or app password
      },
    });
  
    const mailOptions = {
      from: 'beiyofinancetech@gmail.com',
      to: email,
      subject: 'Your email verify OTP',
      text: `Your OTP is ${otp}`,
    };
  
    await transporter.sendMail(mailOptions);
  };

  module.exports = router;