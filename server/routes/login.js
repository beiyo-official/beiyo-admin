const express = require('express');
const router = express.Router();
const Resident = require('../models/newMemberResident');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const genrateOTP = require('../functions/generatingOTP');



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

router.patch('/updatePassword',async(req,res)=>{
  const {newPassword}=req.body;
  try {
    const resident = await Resident.findOne({email});
    resident.password = newPassword;
    await resident.save();
  } catch (error) {
    console.log(error);
  }
});


router.get('/forgetPassword',async(req,res)=>{
  const {email} = req.body;
  const otp = genrateOTP();
  try {
    await sendUniqueIdEmail(email);
    res.json(otp);
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;

const sendUniqueIdEmail = async (email,otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'baxidaksh2004@gmail.com',
      pass: '9425191351',
    },
  });

  const mailOptions = {
    from: 'baxidaksh2004@gmail.com',
    to: email,
    subject: 'Update your Password',
    text: `Your otp is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};


