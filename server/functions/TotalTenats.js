const Hostel = require('../models/Hostel')
const Room = require('../models/Room')
const totalTenants = async (hostelId)=>{
  
 
      let totalTenants = 0;
      const rooms = await Room.find({hostelId:hostelId});
      for(const room of rooms){
        totalTenants += room.capacity-room.remainingCapacity;
      }
      const hostel = await Hostel.findById(hostelId)
      await Hostel.findByIdAndUpdate(
        hostelId,
        { totalTenants: hostel.residents.length },
        { new: true } // Returns the updated document
    );
    
}
module.exports = totalTenants;