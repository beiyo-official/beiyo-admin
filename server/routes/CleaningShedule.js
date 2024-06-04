const express = require('express');
const router = express.Router();
const CleaningSchedule = require('../models/CleaningChart');

// Get cleaning schedule for a specific hostel and month
router.get('/hostels/:hostelId/cleaning-schedule', async (req, res) => {
  const { hostelId } = req.params;
  const { month } = req.query;

  try {
    const schedule = await CleaningSchedule.find({
      hostelId,
      // date: { $regex: `^${month}` } // Fetching entries that start with the month
    });
    res.json(schedule);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create or update a cleaning schedule entry
router.post('/hostels/:hostelId/cleaning-schedule', async (req, res) => {
  const { hostelId } = req.params;
  const { date, roomNumber, cleaned } = req.body;

  try {
    let scheduleEntry = await CleaningSchedule.findOne({ hostelId, date, roomNumber });

    if (scheduleEntry) {
      // Update existing entry
      scheduleEntry.cleaned = cleaned;
    } else {
      // Create new entry
      scheduleEntry = new CleaningSchedule({ hostelId, date, roomNumber, cleaned });
    }

    await scheduleEntry.save();
    res.status(201).send(scheduleEntry);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a cleaning schedule entry (if needed)
router.delete('/hostels/:hostelId/cleaning-schedule/:entryId', async (req, res) => {
  try {
    await CleaningSchedule.findByIdAndDelete(req.params.entryId);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
