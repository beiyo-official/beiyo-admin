const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Resident = require('../models/newMemberResident');

const mappingResident = async () => {
  try {
    const hostels = await Hostel.find();
    
    for (const hostel of hostels) {
      const rooms = await Room.find({ hostelId: hostel._id });
      
      for (const room of rooms) {
        
        if (room.capacity >= room.residents.length) {
          const residents = await Resident.find({ hostelId: hostel._id, roomNumber: room.roomNumber });
        
          
          for (const resident of residents) {
            if (!room.residents.includes(resident._id)) { // Avoid duplicates
              room.residents.push(resident._id);
            }
          }

          // Save the updated room document
          await room.save();
        }
      }
    }
    
    console.log('Resident mapping completed successfully');
  } catch (error) {
    console.error('Error mapping residents:', error);
  }
};

module.exports = mappingResident;
