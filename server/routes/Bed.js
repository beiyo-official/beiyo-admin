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
router.patch('/:id', getBed, async (req, res) => {
  if (req.body.bedNumber != null) {
    res.bed.bedNumber = req.body.bedNumber;
  }
  if (req.body.charge != null) {
    res.bed.charge = req.body.charge;
  }
  if (req.body.paymentStatus != null) {
    res.bed.paymentStatus = req.body.paymentStatus;
  }
  if (req.body.dueDate != null) {
    res.bed.dueDate = req.body.dueDate;
  }
  if (req.body.availableFrom != null) {
    res.bed.availableFrom = req.body.availableFrom;
  }
  try {
    const updatedBed = await res.bed.save();
    res.json(updatedBed);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
async function getBed(req, res, next) {
  let bed;
  try {
    bed = await Bed.findById(req.params.id);
    if (bed == null) {
      return res.status(404).json({ message: 'Bed not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.bed = bed;
  next();
}

module.exports = router;
