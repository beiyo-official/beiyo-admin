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
    const hostels = await Hostel.find().sort({totalRemainingBeds : -1}).sort({name:1});
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
    locationLink:req.body.locationLink,
    price:req.body.price,
    image:req.body.image,
    image2:req.body.image2,
    image3:req.body.image3,
    single:req.body.single,
    singlePrice:req.body.singlePrice,
    doubleprice:req.body.doubleprice,
    tripleprice:req.body.tripleprice,
    nearby1:req.body.nearby1,
    nearby2:req.body.nearby2,
    nearby3:req.body.nearby3,
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
  if (req.body.locationLink != null) {
    res.hostel.locationLink = req.body.locationLink;
  }
  if (req.body.price != null) {
    res.hostel.price = req.body.price;
  }
  if (req.body.image != null) {
    res.hostel.image = req.body.image;
  }
  if (req.body.image2 != null) {
    res.hostel.image2 = req.body.image2;
  }
  if (req.body.image3 != null) {
    res.hostel.image3 = req.body.image3;
  }
  if (req.body.single != null) {
    res.hostel.single = req.body.single;
  }
  if (req.body.singlePrice != null) {
    res.hostel.singlePrice = req.body.singlePrice;
  }
  if (req.body.doubleprice != null) {
    res.hostel.doubleprice = req.body.doubleprice;
  }
  if (req.body.tripleprice != null) {
    res.hostel.tripleprice = req.body.tripleprice;
  }
  if (req.body.nearby1 != null) {
    res.hostel.nearby1 = req.body.nearby1;
  }
  if (req.body.nearby2 != null) {
    res.hostel.nearby2 = req.body.nearby2;
  }
  if (req.body.nearby3 != null) {
    res.hostel.nearby3 = req.body.nearby3;
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
