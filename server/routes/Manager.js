const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const Manager = require('../models/Manager'); // Your Manager model
const uploadFile = require('../firebase/firebase');



router.post('/create', async (req, res) => {
  try {
    const { name, email, mobileNumber, hostelIds, password } = req.body;

    // Create new manager with the provided hostel IDs
    const newManager = new Manager({
      name,
      email,
      mobileNumber,
      password,
      // aadhaarCardUrl,
      // imageUrl,
      hostels: hostelIds // Saving the array of hostel IDs
    });

    await newManager.save();

    res.status(201).json(newManager);
  } catch (error) {
    console.error('Error creating Manager or processing request:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Manager.findOne({ email });
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
 module.exports = router;