// Backend (Node.js/Express)
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const moment = require('moment')

const Resident = require('../models/newMemberResident'); // Your Resident model
const dayjs = require('dayjs');
const Payment = require('../models/Payment');
const Hostels = require('../models/Hostel');
const Rooms = require('../models/Room');
const totalTenants = require('../functions/TotalTenats');
const uuid = require('uuid');
const uploadFile = require('../firebase/firebase');
const Hostel = require('../models/Hostel');
const totalRemainingBeds = require('../functions/totalRemainingBeds');



 router.post('/',async(req,res)=>{
    try {
        const { name, email, mobileNumber, address, parentsName, parentsMobileNo, hostelId, roomNumberId , dateJoined, password, rent,deposit,contractTerm,aadhaarCardUrl,imageUrl} = req.body;
        const formattedDate = dateJoined ? dayjs(dateJoined).format('YYYY-MM-DD') : null;
        const contractEndDate = moment(formattedDate).add(contractTerm, 'months').format('YYYY-MM-DD');
      
        console.log(hostelId);
        const Hostel = await Hostels.findById(hostelId);
        const Room = await Rooms.findById(roomNumberId);
        const hostelName = Hostel.name;
        const roomNumber  = Room.roomNumber;
        

        // Upload Aadhaar Card
        // if (!req.files || !req.files.aadhaarCard || !req.files.image) {
        //   return res.status(400).json({ message: "Missing Aadhaar card or photo file" });
        // }
        // const firebaseUserId = uuid.v4();
        // const [aadhaarCardUrl, imageUrl] = await Promise.all([
        //   uploadFile(req.files.aadhaarCard, `residentAadhaarCards/${firebaseUserId}_aadhaar.jpg`),
        //   uploadFile(req.files.image, `residentImages/${firebaseUserId}_image.jpg`),
        // ]);
        
        const newResident = new Resident({
          name, email, mobileNumber, address, parentsName,
          parentsMobileNo, hostelId, roomNumberId, password, 
          hostel: hostelName,
          roomNumber: roomNumber,
          dateJoined: formattedDate,
          contractEndDate,
          contractTerm,
          rent:rent,
          deposit:deposit,
          aadhaarCardUrl:aadhaarCardUrl,
          imageUrl:imageUrl,
          documentId:firebaseUserId
        });
        await newResident.save();
        const resident = await Resident.findOne({ email });
        await generateMonthlyPayments(resident._id, resident.contractEndDate);
        if(Room.remainingCapacity>0){
          Room.remainingCapacity--;

          Room.residents.push[resident._id];
          await Room.save();
        }else{
          return res.status(400).json({message:"Room is full"});
        }
        await totalTenants(hostelId);
        await totalRemainingBeds(hostelId);
    
        res.status(201).json(newResident);
    } catch (error) {
        console.error('Error creating resident or processing payment:', error);
        res.status(500).send('Internal Server Error');
    }  
 });

 router.get('/', async (req, res) => {
    try {
      const newResidents = await Resident.find();
      updateResidentHostelIds();
      res.json(newResidents);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  router.get('/:id', async (req, res) => {
    try {
      const resident = await Resident.findById(req.params.id);
      if (!resident) {
        return res.status(404).json({ message: 'Resident not found' });
      }
      
      // console.log(`Generating payments for resident: ${resident._id}, contract end date: ${resident.contract}`);
      await generateMonthlyPayments(resident._id, resident.contractEndDate);
      res.json(resident);
    } catch (error) {
      console.error('Error fetching resident or generating payments:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
router.post('/amount',async(req,res)=>{
  try {
    const email = req.body.email;
    const amount = req.body.amount;
    const contract = req.body.contract
    const resident = await Resident.findOneAndUpdate( 
       {  email },
      {  amount,contract: new Date() },
      { new: true }
    );
   

    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    resident.amount = amount;
    resident.contract=contract;
    await resident.save();

  } catch (error) {
    console.log(error);
  }
})

  module.exports = router;
  

    // Payment successful, save user data
    module.exports = router;

    const generateMonthlyPayments = async (userId, contractEndDate) => {
     try {
      const resident = await Resident.findById(userId);
      const startDate = dayjs(resident.dateJoined).startOf('month');
      const endDate = dayjs(contractEndDate).endOf('month');
      let currentDate = startDate;
      
      while (currentDate.isBefore(endDate)) {
        const month = currentDate.format('YYYY-MM');
        const existingPayment = await Payment.findOne({ userId, month });
    
        if (!existingPayment) {
          // rishabh jain mayank hasardani ritk lodhi amount is wrong
          const payment = new Payment({
            userId,
            userName:resident.name,
            amount: resident.rent, // Replace with the appropriate amount
            month,
            date: currentDate.toDate(),
            status: 'due'
          });
    
          await payment.save();
          resident.payments.push(payment._id);
         
        }
    
        currentDate = currentDate.add(1, 'month');
        await resident.save();
      }
     } catch (error) {
      console.log(error);
     }
    };
    
    async function updateResidentHostelIds() {
      try {
        // Fetch all residents
        const residents = await Resident.find();
    
        // Iterate over each resident
        for (const resident of residents) {
          // Find hostel ID by hostel name
          const hostel = await Hostel.findOne({ name: resident.hostel });
          
          if (hostel) {
            // Update resident with the found hostel ID
            await Resident.updateOne(
              { _id: resident._id },
              { $set: { hostelId: hostel._id } }
            );
            console.log(`Updated resident ${resident.name} with hostel ID ${hostel._id}`);
          } else {
            console.log(`Hostel not found for resident ${resident.name}`);
          }
        }
      } catch (error) {
        console.error('Error updating resident hostel IDs:', error);
      }
    }
    