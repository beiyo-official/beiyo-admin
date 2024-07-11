// Backend (Node.js/Express)
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Resident = require('../models/newMemberResident'); // Your Resident model
const dayjs = require('dayjs');
 router.post('/',async(req,res)=>{
    try {
        const { name, email, mobileNumber, address, parentsName, parentsMobileNo, hostel, roomNumber , dateJoined, password,cash} = req.body;
        const formattedDate = dateJoined ? dayjs(dateJoined).format('YYYY-MM-DD') : null;
        const newResident = new Resident({
            name, email, mobileNumber, address, parentsName,
            parentsMobileNo, hostel, roomNumber,password,cash,
            dateJoined: formattedDate
          });
          await newResident.save();
    res.status(201).json(newResident);
    } catch (error) {
        console.error('Error creating resident or processing payment:', error);
        res.status(500).send('Internal Server Error');
    }  
 });

 router.get('/', async (req, res) => {
    try {
      const newResidents = await Resident.find();
      res.json(newResidents);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  router.get('/:id',async(req,res)=>{
    const resident = await Resident.findById(req.params.id);
    res.json(resident);
  })

    // Payment successful, save user data
    module.exports = router;

