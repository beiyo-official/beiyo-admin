const mongoose = require('mongoose');

const cleaningScheduleSchema = new mongoose.Schema({
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  cleaned: {
    type: Boolean,
    default: false
  }
});

const CleaningSchedule = mongoose.model('CleaningSchedule', cleaningScheduleSchema);

module.exports = CleaningSchedule;
