  const express = require('express');
  const router = express.Router();
  const Staff = require('../models/Staff');


  router.post('/', async (req, res) => {
      try {
        const { name, role, area } = req.body;
        const staff = new Staff({ name, role, area });
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
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });


    module.exports = router;
    