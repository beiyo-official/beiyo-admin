const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['Area Manager', 'Technician'], required: true },
  area: { type: String }, // For area managers
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;


