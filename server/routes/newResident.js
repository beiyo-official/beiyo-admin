// Backend (Node.js/Express)
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Resident = require('../models/newMemberResident'); // Your Resident model
const dayjs = require('dayjs');
 router.post('/',async(req,res)=>{
    try {
        const { name, email, mobileNumber, address, parentsName, parentsMobileNo, hostel, roomNumber , dateJoined, password} = req.body;
        const formattedDate = dateJoined ? dayjs(dateJoined).format('YYYY-MM-DD') : null;
        const newResident = new Resident({
            name, email, mobileNumber, address, parentsName,
            parentsMobileNo, hostel, roomNumber,password,
            dateJoined: formattedDate
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

