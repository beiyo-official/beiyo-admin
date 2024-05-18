const express = require('express');
const router = express.Router();
const Beds = require('../models/Beds');
const Room = require('../models/Room');



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
router.get('/:bedId',async(req,res)=>{
  const {bedId}=req.params;
  try{
    const beds = await Beds.find({ bedId });
    res.json(beds);
  } catch (error) {
    console.error('Error fetching beds:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
// Update bed details
router.patch('/:bedId', async (req, res) => {
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
router.delete('/:bedId', async (req, res) => {
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
