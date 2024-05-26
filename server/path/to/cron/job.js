const cron = require('node-cron');
// const axios = require('axios');
const Room = require('../../../models/Room'); // Adjust the path to your Room model

// Function to update room statuses
 updateRoomStatuses = async () => {
  const twoDaysAgo = new Date(Date.now() -2 * 24 * 60 * 60 * 1000);
// 
  try {
    // Find rooms that are "clean" and were last cleaned more than two days ago
    const roomsToUpdate = await Room.find({ 
      status: 'clean',
      lastCleanedAt: { $lt: twoDaysAgo }
    });

    // Update each room's status to "dirty"
    for (const room of roomsToUpdate) {
      room.status = 'dirty';
      await room.save();
    }

    console.log(`Updated ${roomsToUpdate.length} rooms to dirty status`);
  } catch (error) {
    console.error('Error updating room statuses:', error);
  }
};

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', updateRoomStatuses);
module.exports =  {updateRoomStatuses} ;
