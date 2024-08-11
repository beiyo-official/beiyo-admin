const mongoose = require('mongoose');
const  appVersionSchema = new mongoose.Schema({
 appVersion: String,
 downloadLink:String,
  // Represents the remaining capacity of the room
  // Add more fields as needed
});

const AppVersion = mongoose.model('AppVersion', appVersionSchema);

module.exports = AppVersion;
