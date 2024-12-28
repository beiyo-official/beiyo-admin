// routes/roomRoutes.js

const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Hostel = require('../models/Hostel');
const cron = require('node-cron');
const Beds = require('../models/Beds');
const totalTenants = require('../functions/TotalTenats');
const Resident = require('../models/newMemberResident');
const mappingResident = require('../functions/MappingResident');
const totalRemainingBeds = require('../functions/totalRemainingBeds');
const Payment = require('../models/Payment');
const ExcelJS = require("exceljs");

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().sort({hostel:1}).sort({roomNumber:1});
    if(rooms===null){
      res.status(404).json({message: "No rooms found"});
    }
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a room detail
router.get('/:id', getRoom, (req, res) => {
  res.json(res.room);
});

// Get all single rooms
router.get('/single', async (req, res) => {
  try {
    const singleRooms = await Room.find({ capacity: 1 });
    if(singleRooms===null){
      res.status(404).json({message: "No single rooms found"});
    }
    res.json(singleRooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all double rooms
router.get('/double', async (req, res) => {
  try {
    const doubleRooms = await Room.find({ capacity: 2 });
    if(doubleRooms===null){
      res.status(404).json({message: "No double rooms found"});
      }
    res.json(doubleRooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all triple rooms
router.get('/triple', async (req, res) => {
  try {
    const tripleRooms = await Room.find({ capacity: 3 });
    res.json(tripleRooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// geting resident information through room
router.get('/residentDetail/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('residents');

    // Check if room exists
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Fetch all resident details (populated residents from the Room document)
    const residents = room.residents;

    // Return the details of the residents
    res.json(residents);
  } catch (error) {
    console.error('Error fetching resident details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// available rooms in specfic hostel
router.get('/availableRooms/:hostelId',async(req,res)=>{
  try {
    const { hostelId } = req.params;

    // Find rooms where remainingCapacity is greater than 0 and match the hostelId
    const availableRooms = await Room.find({
      hostelId: hostelId, // Assuming you want to filter by hostelId as well
      remainingCapacity: { $gt: 0 }
    });
    if(!availableRooms){
      res.json({message:"No available rooms"});
    }
    res.json(availableRooms); // Respond with the available rooms
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error'); // Send a generic error response
  }
})

// Create a new room
router.post('/', async (req, res) => {
  try {
    // Find the hostel by ID
    const hostel = await Hostel.findById(req.body.hostelId);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    // Create the new room
    const room = new Room({
      hostelId: req.body.hostelId,
      hostel: hostel.name,
      roomNumber: req.body.roomNumber,
      capacity: req.body.capacity,
      remainingCapacity: req.body.remainingCapacity,
      type: req.body.type,
      price: req.body.price,
    });

    // Save the room
    const newRoom = await room.save();

    // Update the hostel's rooms array and recalculate totals
    hostel.rooms.push(newRoom._id);
    hostel.totalRooms = hostel.rooms.length;
    hostel.totalBeds = (hostel.totalBeds || 0) + newRoom.capacity;
    // Save the updated hostel
    await hostel.save();
    totalRemainingBeds(room.hostelId);

    // Respond with the new room
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// update room
router.put('/:id', async (req, res) => {
  try {
    const roomId = req.params.id;
    
    // Extract the data to update from the request body
    const updateData = req.body;

    // Find the Room by ID and update it with the provided data
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({
      message: 'Room updated successfully',
      data: updatedRoom,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Room', error: error.message });
  }
});

// swap rooms
router.put("/roomSwap/:residentId", async (req, res) => {
  try {
    const { oldRoomId, newRoomId } = req.body;
    const residentId = req.params.residentId;

    // Find and update old room (increment remaining capacity by 1)
    const oldRoom = await Room.findByIdAndUpdate(
      oldRoomId,
      { $inc: { remainingCapacity: 1 } },
      { new: true }
    );
    if (!oldRoom) {
      return res.status(404).json({ message: "Old room not found" });
    }

    // Find old hostel
    const oldHostel = await Hostel.findById(oldRoom.hostelId);
    if (!oldHostel) {
      return res.status(404).json({ message: "Old hostel not found" });
    }

    // Find and update new room (decrement remaining capacity by 1)
    const newRoom = await Room.findByIdAndUpdate(
      newRoomId,
      { $inc: { remainingCapacity: -1 } },
      { new: true }
    );
    if (!newRoom) {
      return res.status(404).json({ message: "New room not found" });
    }

    // Find new hostel
    const newHostel = await Hostel.findById(newRoom.hostelId);
    if (!newHostel) {
      return res.status(404).json({ message: "New hostel not found" });
    }

    // Update resident details with new hostel and room info
    const resident = await Resident.findByIdAndUpdate(
      residentId,
      {
        hostelId: newHostel._id,
        roomNumberId: newRoom._id,
        hostel: newHostel.name,
        roomNumber: newRoom.roomNumber,
        rent: newRoom.price
      },
      { new: true } // Return updated resident
    );
    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }

    // Update residents array in rooms and hostels
    oldRoom.residents.pull(residentId);
    await oldRoom.save();
    oldHostel.residents.pull(residentId);
    await oldHostel.save();
    newRoom.residents.push(residentId);
    await newRoom.save();
    newHostel.residents.push(residentId);
    await newHostel.save();

    // Update future payments for the resident
    const currentDate = new Date();
    const futurePayments = await Payment.updateMany(
      { userId: residentId, date: { $gt: currentDate } },
      { $set: { rent: newRoom.price, amount: newRoom.price } }
    );

    // Update total tenants and remaining beds
    await totalTenants(oldHostel._id);
    await totalTenants(newHostel._id);
    await totalRemainingBeds(oldHostel._id);
    await totalRemainingBeds(newHostel._id);

    // Return updated resident information
    res.json(resident);
  } catch (error) {
    console.error("Error during room swap:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// excel room ids for every hostel
router.get("/hostel/allRoomIdExcelSheet", async (req, res) => {
  try {
    // Fetch all hostels and populate the rooms
    const hostels = await Hostel.find().populate("rooms");

    if (!hostels || hostels.length === 0) {
      return res.status(404).json({ error: "No hostels found" });
    }

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // Add a worksheet for each hostel
    hostels.forEach((hostel) => {
      const worksheet = workbook.addWorksheet(hostel.name || `Hostel_${hostel._id}`);

      // Add headers to the worksheet
      worksheet.columns = [
        { header: "Room Number", key: "roomNumber", width: 15 },
        { header: "Room ID", key: "roomId", width: 30 },
      ];

      // Add room data to the worksheet
      hostel.rooms.forEach((room) => {
        worksheet.addRow({
          roomNumber: room.roomNumber,
          roomId: room._id,
        });
      });
    });

    // Set the response headers for file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=all_hostels_rooms.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (error) {
    console.error("Error fetching or generating Excel sheet: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// specific hostel rooms
router.get("/hostel/:hostelId",async(req,res)=>{
  try{
   const room = await Room.find({hostelId:req.params.hostelId});  
  //  totalRemainingBeds(req.params.hostelId);
   res.json(room);
  }catch(error){
   console.error('Error fetching ', error);
   res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a room
router.delete('/delete/:id', getRoom, async (req, res) => {
  try {
    await res.room.remove();
     await totalRooms();
    await totalBeds();
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/sheet/roomAvailable',async(req,res)=>{
  try {
    // Fetch all hostels and populate the rooms
    const hostels = await Hostel.find().populate("rooms");

    if (!hostels || hostels.length === 0) {
      return res.status(404).json({ error: "No hostels found" });
    }

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // Add a worksheet for each hostel
    hostels.forEach((hostel) => {
      const worksheet = workbook.addWorksheet(hostel.name || `Hostel_${hostel._id}`);

      // Add headers to the worksheet
      worksheet.columns = [
        { header: "Room Number", key: "roomNumber", width: 15 },
        { header: "Room ID", key: "roomId", width: 30 },
        { header: "Remaining Capacity", key: "remainingCapacity", width: 20 },
      ];

   
    // Add only available rooms (remainingCapacity > 0) to the worksheet
    hostel.rooms
      .filter((room) => room.remainingCapacity > 0) // Filter rooms by remaining capacity
      .forEach((room) => {
        worksheet.addRow({
          roomNumber: room.roomNumber,
          roomId: room._id,
          remainingCapacity: room.remainingCapacity,
        });
      });
  });

    // Set the response headers for file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=all_hostels_rooms.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (error) {
    console.error("Error fetching or generating Excel sheet: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

// Middleware function to get room by ID
async function getRoom(req, res, next) {
  let room;
  try {
    room = await Room.findById(req.params.id);
    if (room == null) {
      return res.status(404).json({ message: 'Room not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.room = room;
  next();
}

module.exports = router;


