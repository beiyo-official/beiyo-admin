// models/HelpTopic.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const helpTopicSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('HelpTopic', helpTopicSchema);
