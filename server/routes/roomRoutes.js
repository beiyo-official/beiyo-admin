// routes/roomRoutes.js

const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Beds = require('../models/Beds');
// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().sort({hostel:1});
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  const { remainingBeds } = req.body;
  if (remainingBeds == null || isNaN(remainingBeds) || remainingBeds < 0 || remainingBeds > res.room.capacity) {
    return res.status(400).json({ message: 'Invalid remaining beds' });
  }
  res.room.remainingCapacity = remainingBeds;
  try {
    const updatedRoom = await res.room.save();
    res.json(updatedRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// getting single room
router.get("/api/rooms/:id",async(req,res)=>{
  try{
   const room = await Room.findById(req.params.id);  
   if(!room){
     alert("no room are available");
   }
   res.json(hostel);
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
