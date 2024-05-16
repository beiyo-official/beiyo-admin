// routes/hostelRoutes.js

const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');


router.get('/calculateTotalRemainingBeds', async (req, res) => {
  try {
    const hostels = await Hostel.find();
    
    for (const hostel of hostels) {
      const rooms = await Room.find({ hostelId: hostel._id });
      let totalRemainingBeds = 0;
      for (const room of rooms) {
        totalRemainingBeds += room.remainingCapacity;
      }
      hostel.totalRemainingBeds = totalRemainingBeds;
      await hostel.save();
    }

    res.json({ message: 'Total remaining beds calculated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get all hostels
router.get('/', async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single hostel
router.get('/:id', getHostel, (req, res) => {
  res.json(res.hostel);
});

// Create a new hostel
router.post('/', async (req, res) => {
  const hostel = new Hostel({
    name: req.body.name,
    location: req.body.location,
  });

  try {
    const newHostel = await hostel.save();
    res.status(201).json(newHostel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a hostel
router.patch('/:id', getHostel, async (req, res) => {
  if (req.body.name != null) {
    res.hostel.name = req.body.name;
  }
  if (req.body.location != null) {
    res.hostel.location = req.body.location;
  }
  try {
    const updatedHostel = await res.hostel.save();
    res.json(updatedHostel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a hostel
router.delete('/:id', getHostel, async (req, res) => {
  try {
    await res.hostel.remove();
    res.json({ message: 'Hostel deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Middleware function to get hostel by ID
async function getHostel(req, res, next) {
  let hostel;
  try {
    hostel = await Hostel.findById(req.params.id);
    if (hostel == null) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.hostel = hostel;
  next();
}

module.exports = router;
