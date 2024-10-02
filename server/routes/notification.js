const express = require('express');
const router = express.Router();
const Resident = require('../models/newMemberResident');

router.get('/rent/:month',async(req,res)=>{
    const resident = await Resident.find({"living":"current"}).populate(payments);
    sendUniqueIdEmail()

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
      subject: 'Your OTP for Password Reset',
      text: `Your OTP for resetting your password is ${otp}`,
    };
  
    await transporter.sendMail(mailOptions);
  };

  module.exports = router;
  