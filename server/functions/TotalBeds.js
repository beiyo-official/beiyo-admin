const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Bed = require('../models/Beds')
const totalBeds = async (hostelId) => {
 
    
    console.log("function started");
   
     
        
        let total = 0;
        const rooms = await Room.find({ hostelId: hostelId });

      
        for (const room of rooms) {
                total+=room.capacity
        }

        await Hostel.findByIdAndUpdate(
            hostelId,
            { totalBeds: total },
            { new: true } // Returns the updated document
        );
    return;
   
};




module.exports = totalBeds;