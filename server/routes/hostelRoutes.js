// routes/hostelRoutes.js

const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Resident = require('../models/newMemberResident');
const Payment = require('../models/Payment');
// const Ticket = require('../models/ticket');

const totalRooms = require('../functions/TotalRooms');
const totalBeds = require('../functions/TotalBeds');
const mappingResidentToHostel = require('../functions/mappingResidentsToHostel');


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

router.get('/paymentCheck/:hostelId', async (req,res)=>{
    const allMonthPayments = [];
    const month = req.body.month;
    const hostelId = req.params.hostelId
    const Residents = await Resident.find({hostelId:hostelId});
   for(const Resident of Residents){
    const Payments = await Payment.find({userId:Resident._id ,month:month});
    allMonthPayments.push(Payments);
   }
    res.json(allMonthPayments);
});



router.get('/adminTickets/:hostelId',async(req,res)=>{
  try {
    const hostel = await Hostel.findById(req.params.hostelId).populate('adminTickets');
    const adminTickets = hostel.adminTickets;
   
    
    res.json(adminTickets);

  } catch (error) {
   console.error('Error fetching ticket details:', error);
    res.status(500).json({ message: 'Server error' });
  }
})
router.get('/managerTickets/:hostelId',async(req,res)=>{
  try {
    const hostel = await Hostel.findById(req.params.hostelId).populate('managerTickets');
    const managerTickets = hostel.managerTickets;
   
   
    res.json(managerTickets);

  } catch (error) {
   console.error('Error fetching ticket details:', error);
    res.status(500).json({ message: 'Server error' });
  }
})



// Get all hostels
router.get('/', async (req, res) => {
  try {
  await  totalRooms();
  await  totalBeds();
  // await mappingResidentToHostel();
  const { page = 1, limit = 10  } = req.params;
  const hostels = await Hostel.find()
  .sort({ totalRemainingBeds: -1, name: 1 })
  .skip((page - 1) * limit)
  .limit(parseInt(limit));
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.get('/', async (req, res) => {
//   try {
//     // await totalRooms();
//     // await totalBeds();

//     const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit of 10

//     const hostels = await Hostel.find()
//       .sort({ totalRemainingBeds: -1, name: 1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const totalHostels = await Hostel.countDocuments(); // Total number of hostels

//     res.json({
//       hostels,
//       currentPage: page,
//       totalPages: Math.ceil(totalHostels / limit),
//       totalHostels,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// update hostels
router.put('/:id', async (req, res) => {
  try {
    const hostelId = req.params.id;
    
    // Extract the data to update from the request body
    const updateData = req.body;

    // Find the resident by ID and update it with the provided data
    const updatedHostel = await Hostel.findByIdAndUpdate(
      hostelId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedHostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    res.status(200).json({
      message: 'Hostel updated successfully',
      data: updatedHostel,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating hostel', error: error.message });
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
    doublePrice:req.body.doublePrice,
    triplePrice:req.body.triplePrice,
    nearby1:req.body.nearby1,
    nearby2:req.body.nearby2,
    nearby3:req.body.nearby3,
    nearby1distance:req.body.nearby1distance,
    nearby2distance:req.body.nearby2distance,
    nearby3distance:req.body.nearby3distance,
  });

  try {
    const newHostel = await hostel.save();
    res.status(201).json(newHostel);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err);
  }
});

router.get('/calculateHostelTotalRooms',async (req,res)=>{
  try {
   totalRooms();
  } catch (error) {
  console.log(error)
  }
})

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
  if (req.body.doublePrice != null) {
    res.hostel.doublePrice = req.body.doublePrice;
  }
  if (req.body.triplePrice != null) {
    res.hostel.triplePrice = req.body.triplePrice;
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
