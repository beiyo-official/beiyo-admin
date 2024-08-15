const Hostel = require('../models/Hostel');
const Room = require('../models/Room');

const totalRooms = async () => {
    const hostels = await Hostel.find();
    
    
    for (const hostel of hostels) {
      
        
        let total = 0;
        const rooms = await Room.find({ hostelId: hostel._id });

     

        for (const room of rooms) {
            total++;
        }

        hostel.totalRooms = total;
        await hostel.save();
    }

    return;
};


module.exports = totalRooms;
