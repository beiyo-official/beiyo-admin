const express = require('express');
const router = express.Router();
const Beds = require('../models/Beds');
const Room = require('../models/Room');

// Add a new bed to a room
router.post('/rooms/:roomId/beds', async (req, res) => {
  const { roomId } = req.params;
//   const { isEmpty, charge, availableFrom, paymentStatus, duration, dueDate } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // if (room.beds.length >= room.capacity) {
    //   return res.status(400).json({ error: 'Cannot add more beds than room capacity' });
    // }

    const beds = [];
    for (let i = 1; i <= room.capacity; i++) {
      const bed = new Beds({ roomId: room._id, bedNumber: `Bed ${i}` });
      await bed.save();
      beds.push(bed._id);
    }

    // Update room with created beds
    room.beds = beds;
    await room.save();


    // const bed = new Bed({ roomId, isEmpty, charge, availableFrom, paymentStatus, duration, dueDate });
    // await bed.save();

    // room.beds.push(bed._id);
    // room.remainingCapacity -= 1;
    // await room.save();

    res.status(201).json(beds);
  } catch (error) {
    console.error('Error adding bed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all beds for a room
router.get('/rooms/:roomId/beds', async (req, res) => {
  const { roomId } = req.params;

  try {
    const beds = await Beds.find({ roomId });
    res.json(beds);
  } catch (error) {
    console.error('Error fetching beds:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update bed details
router.patch('/beds/:bedId', async (req, res) => {
  const { bedId } = req.params;
  const updates = req.body;

  try {
    const bed = await Beds.findByIdAndUpdate(bedId, updates, { new: true });
    if (!bed) {
      return res.status(404).json({ error: 'Bed not found' });
    }
    res.json(bed);
  } catch (error) {
    console.error('Error updating bed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a bed
router.delete('/beds/:bedId', async (req, res) => {
  const { bedId } = req.params;

  try {
    const bed = await Beds.findByIdAndDelete(bedId);
    if (!bed) {
      return res.status(404).json({ error: 'Bed not found' });
    }

    const room = await Room.findById(bed.roomId);
    room.beds.pull(bed._id);
    room.remainingCapacity += 1;
    await room.save();

    res.json({ message: 'Bed deleted successfully' });
  } catch (error) {
    console.error('Error deleting bed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
