const Hostel = require('../models/Hostel')
const Room = require('../models/Room')
const totalTenants = async ()=>{
    const hostels = await Hostel.find();
 
    for(const hostel of hostels){
      let totalTenants = 0;
      const rooms = await Room.find({hostelId:hostel._id});
      for(const room of rooms){
        totalTenants += room.capacity-room.remainingCapacity;
        console.log("room capacity: "+room.capacity);
        console.log("room remainingCapacity: "+room.capacity);
      }
      hostel.totalTenants=totalTenants;
      await hostel.save();
    }
}
module.exports = totalTenants;