// // models/Ticket.js
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const ticketSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'Resident', required: true },
//   name: { type: String, required: true },
//   hostel: { type: String, required: true },
//   room: { type: String, required: true },
//   helpTopic: { type: String, required: true },
//   description: { type: String, required: true },
//   status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Ticket', ticketSchema);

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const ticketSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'Resident', required: true },
//   name: { type: String, required: true },
//   hostel: { type: String, required: true },
//   room: { type: String, required: true },
//   helpTopic: { type: String, required: true },
//   description: { type: String, required: true },
//   priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' }, // Add priority
//   category: { type: String, enum: ['Maintenance', 'Cleanliness', 'Security', 'Other'], default: 'Other' }, // Add category
//   status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
//   assignedTo: { type: Schema.Types.ObjectId, ref: 'Staff' }, // Add assignedTo for area manager or technician
//   resolution: { type: String }, // Add resolution details
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Ticket', ticketSchema);


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Resident', required: true },
  name: { type: String, required: true },
  hostel: { type: String, required: true },
  hostelId:{ type: Schema.Types.ObjectId, ref: 'Hostel'},
  room: { type: String, required: true },
  helpTopic: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' }, // Priority
  category: { type: String, enum: ['Maintenance', 'Cleanliness', 'Security', 'Other'], default: 'Other' }, // Category
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'Staff' }, // Staff member assigned
  resolution: { type: String }, // Resolution details
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }], // Array of comment references
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ticket', ticketSchema);

