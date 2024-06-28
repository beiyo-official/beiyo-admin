// Backend (Node.js/Express)
const express = require('express');

const Resident = require('../models/newMemberResident'); // Your Resident model
const router = express.Router();

 router.post('/',async(req,res)=>{
    try {
        const { name, email, mobileNumber, address, parentsName, parentsMobileNo, hostel, roomNumber} = req.body;
        const newResident = new Resident({
            name, email, mobileNumber, address, parentsName,
            parentsMobileNo, hostel, roomNumber
          });
          await newResident.save();
    res.status(201).json(newResident);
   
    } catch (error) {
        console.error('Error creating resident or processing payment:', error);
        res.status(500).send('Internal Server Error');
    }  
 });
    // Payment successful, save user data
    module.exports = router;

  