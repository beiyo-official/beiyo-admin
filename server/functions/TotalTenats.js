const Hostel = require('../models/Hostel')
const Room = require('../models/Room')
const totalTenants = async (hostelId)=>{
  
 
      let totalTenants = 0;
      const rooms = await Room.find({hostelId:hostelId});
      for(const room of rooms){
        totalTenants += room.capacity-room.remainingCapacity;
      }
      await Hostel.findByIdAndUpdate(
        hostelId,
        { totalTenants: totalTenants },
        { new: true } // Returns the updated document
    );
    
}
module.exports = totalTenants;