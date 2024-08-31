const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Resident = require('../models/newMemberResident');

const mappingResident = async () => {
  try {
   const residents = await Resident.find();
   for (const resident of residents){
    const room = await Room.findOne({ roomNumber: resident.roomNumber ,hostelId:resident.hostelId});
    if (room) {
      // Update the resident with the room's _id
      const res = await Resident.findByIdAndUpdate(
        resident._id,
        { roomNumberId: room._id },
        { new: true }
      );
      
      console.log(res);
    } else {
      console.log(`Room with roomNumber ${resident.roomNumber} not found for resident ${resident._id}`);
    }

   }
    
    console.log('Resident mapping completed successfully');
  } catch (error) {
    console.error('Error mapping residents:', error);
  }
};

module.exports = mappingResident;
