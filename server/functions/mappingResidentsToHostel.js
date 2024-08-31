const Hostel = require('../models/Hostel');
// const Room = require('../models/Room');
const Resident = require('../models/newMemberResident');

const mappingResidentToHostel = async () => {
  try {
    const hostels = await Hostel.find();
    
    for (const hostel of hostels) {

      
     
        
        if (hostel.totalTenants >= hostel.residents.length) {
          const residents = await Resident.find({ hostelId: hostel._id });
        console.log('find residents')
          
          for (const resident of residents) {
            if (!hostel.residents.includes(resident._id)) { // Avoid duplicates
              hostel.residents.push(resident._id);
              await hostel.save();
            }
          }

          // Save the updated room document
      
      }
    }
    
    console.log('Resident mapping completed successfully');
  } catch (error) {
    console.error('Error mapping residents:', error);
  }
};

module.exports = mappingResidentToHostel;
