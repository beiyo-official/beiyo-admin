  const express = require('express');
  const router = express.Router();
  const Staff = require('../models/Staff');
const dayjs = require('dayjs');
const moment = require('moment')
  router.post('/', async (req, res) => {
      try {
        const { name,mobileNumber,
           address, nearOneName,
          nearOneMobileNo,area,role,
          dateJoined,
          contractTerm,
          aadhaarCardUrl,imageUrl,hostelIds,
      uniqueId
         } = req.body;
        const formattedDate = dateJoined ? dayjs(dateJoined).format('YYYY-MM-DD') : null;
        const contractEndDate = moment(formattedDate).add(contractTerm, 'months').format('YYYY-MM-DD');

        const staff = new Staff({
          name,mobileNumber, 
          address, nearOneName,
          nearOneMobileNo,area,  
          dateJoined: formattedDate,
          contractEndDate,
          contractTerm,
          aadhaarCardUrl:aadhaarCardUrl,
          imageUrl:imageUrl,
          role,
          hostelIds,uniqueId
        });
        await staff.save();
        res.status(201).json(staff);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
    
    router.get('/', async (req, res) => {
      try {
        const staffMembers = await Staff.find();
        res.json(staffMembers);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    router.get('/area',async(req,res)=>{
      try {
        const area = req.body.area
        const staffMembers = await Staff.find({area:area});
        res.json(staffMembers);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    })
    router.get('/role',async(req,res)=>{
      try {
        const role = req.body.role
        const staffMembers = await Staff.find({role:role});
        res.json(staffMembers);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    })
 router.get('/role/area',async(req,res)=>{
  try {
    const role = req.body.role;
    const area = req.body.area
    const staffMembers = await Staff.find({role:role,area:area});
    res.json(staffMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 })
    router.put('/:id', async (req, res) => {
      try {
        const staffId = req.params.id;
        const updates = req.body;
        const staffMember = await Staff.findByIdAndUpdate(staffId, updates, { new: true });
        if (!staffMember) {
          return res.status(404).json({ message: 'Staff member not found' });
        }
        res.json(staffMember);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    router.delete('/:id', async (req, res) => {
      try {
        const staffId = req.params.id;
        await Staff.findByIdAndDelete(staffId);
        res.status(204).json("Staff successfully delted");
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });


    module.exports = router;
    