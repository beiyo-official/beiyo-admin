// routes/roomRoutes.js

const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Hostel = require('../models/Hostel');
const cron = require('node-cron');
const Beds = require('../models/Beds');
const totalTenants = require('../functions/TotalTenats');
const Resident = require('../models/newMemberResident');
const mappingResident = require('../functions/MappingResident');
const totalRemainingBeds = require('../functions/totalRemainingBeds');

// Get all rooms
router.get('/', async (req, res) => {
  try {
    mappingResident();
    const rooms = await Room.find().sort({hostel:1}).sort({roomNumber:1});

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// geting resident information through room
router.get('/residentDetail/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('residents');

    // Check if room exists
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Fetch all resident details (populated residents from the Room document)
    const residents = room.residents;

    // Return the details of the residents
    res.json(residents);
  } catch (error) {
    console.error('Error fetching resident details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get a single room
router.get('/:id', getRoom, (req, res) => {
  res.json(res.room);
});

// Get all single rooms
router.get('/single', async (req, res) => {
  try {
    const singleRooms = await Room.find({ capacity: 1 });
    res.json(singleRooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/mapingResident',async(req,res)=>{
  try {
    const Hostels = await Hostel.find();
    const Rooms = await Room.find();
    for(const hostel of Hostels ){
     
      const rooms = await Room.find({hostel:hostel._id});
      for(const room of rooms ){
        if(room.capacity<=room.residents.length){
          const Residents = await Resident.find({hostelId:hostel._id,roomNumber:room.roomNumber});
       for(const resident of Residents){
        room.residents.push(resident._id);
       }
        }
      }
    }
  res.json(Rooms);
  } catch (error) {
    console.log(error)
  }
})

router.get('/availableRooms/:hostelId',async(req,res)=>{
  try {
    const { hostelId } = req.params;

    // Find rooms where remainingCapacity is greater than 0 and match the hostelId
    const availableRooms = await Room.find({
      hostelId: hostelId, // Assuming you want to filter by hostelId as well
      remainingCapacity: { $gt: 0 }
    });
    if(!availableRooms){
      res.json({message:"No available rooms"});
    }
    res.json(availableRooms); // Respond with the available rooms
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error'); // Send a generic error response
  }
})

// Get all double rooms
router.get('/double', async (req, res) => {
  try {
    const doubleRooms = await Room.find({ capacity: 2 });
    res.json(doubleRooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all triple rooms
router.get('/triple', async (req, res) => {
  try {
    const tripleRooms = await Room.find({ capacity: 3 });
    res.json(tripleRooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new room
router.post('/', async (req, res) => {
  const room = new Room({
    hostelId: req.body.hostelId,
    hostel: req.body.hostel, 
    roomNumber: req.body.roomNumber,
    capacity: req.body.capacity,
    remainingCapacity:req.body.remainingCapacity,
    type:req.body.type,
    price:req.body.price,
  });

  try {
    const newRoom = await room.save();
    res.status(201).json(newRoom);
  

    const beds = [];
    for (let i = 1; i <= room.capacity; i++) {
      const bed = new Beds({ roomId: room._id, bedNumber: `Bed ${i}`,roomNumber: room.roomNumber });
      await bed.save();
      beds.push(bed._id);
    }

    // Update room with created beds
    room.beds = beds;
    await room.save();
    totalRemainingBeds();
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a room
router.patch('/:id', getRoom, async (req, res) => {
  if (req.body.roomNumber != null) {
    res.room.roomNumber = req.body.roomNumber;
  }
  if (req.body.capacity != null) {
    res.room.capacity = req.body.capacity;
  }
  if(req.body.status != null){
    res.room.status = req.body.status;
  }

  
    res.room.lastUpdatedBy = req.body.lastUpdatedBy;
  
  try {
    const updatedRoom = await res.room.save();
    res.json(updatedRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update remaining capacity of a room
router.patch('/:id/updateCapacity', getRoom, async (req, res) => {
  const { remainingCapacity } = req.body;
  if (remainingCapacity == null || isNaN(remainingCapacity) || remainingCapacity < 0) {
    return res.status(400).json({ message: 'Invalid remaining capacity' });
  }
  res.room.remainingCapacity = remainingCapacity;
  try {
    const updatedRoom = await res.room.save();
    res.json(updatedRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id/updateRemainingBeds', getRoom, async (req, res) => {
  const { remainingBeds, lastUpdatedBy } = req.body;
  if (remainingBeds == null || isNaN(remainingBeds) || remainingBeds < 0 || remainingBeds > res.room.capacity) {
    return res.status(400).json({ message: 'Invalid remaining beds' });
  }
  res.room.remainingCapacity = remainingBeds;
  res.room.lastUpdatedBy = lastUpdatedBy;
  try {
    const updatedRoom = await res.room.save();
    totalTenants();
    totalRemainingBeds();
    res.json(updatedRoom);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }

});

// getting single room
router.get("/:id",async(req,res)=>{
  try{
   const room = await Room.findById(req.params.id);  
   if(!room){
     alert("no room are available");
   }
   res.json(room);
  }catch(error){
   console.error('Error fetching ', error);
   res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get("/hostel/:hostelId",async(req,res)=>{
  try{
   const room = await Room.find({hostelId:req.params.hostelId});  
   res.json(room);
  }catch(error){
   console.error('Error fetching ', error);
   res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Delete a room
router.delete('/delete/:id', getRoom, async (req, res) => {
  try {
    await res.room.remove();
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get room by ID
async function getRoom(req, res, next) {
  let room;
  try {
    room = await Room.findById(req.params.id);
    if (room == null) {
      return res.status(404).json({ message: 'Room not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.room = room;
  next();
}

module.exports = router;


