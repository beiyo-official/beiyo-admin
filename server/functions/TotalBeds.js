const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Bed = require('../models/Beds')
const totalBeds = async () => {
    const hostels = await Hostel.find();
    
    
    for (const hostel of hostels) {
     
        
        let total = 0;
        const rooms = await Room.find({ hostelId: hostel._id });

      
        for (const room of rooms) {
                total+=room.capacity
        }

        await Hostel.findByIdAndUpdate(
            hostel._id,
            { totalBeds: total },
            { new: true } // Returns the updated document
        );
    }

    return;
};


module.exports = totalBeds;