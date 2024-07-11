// models/Ticket.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Resident', required: true },
  name: { type: String, required: true },
  hostel: { type: String, required: true },
  room: { type: String, required: true },
  helpTopic: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
}, {
  timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
