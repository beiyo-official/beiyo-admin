const express = require('express');
const router = express.Router();
const Resident = require('../models/newMemberResident');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

    const token = jwt.sign({ userId: user._id }, proccess.env.JWT_SECRET , { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
