  const express = require('express');
  const router = express.Router();
  const Member = require('../models/Member');

  router.post('/', async (req, res) => {
      try {
        const { name,mobileNumber,
           address,
        post,
          aadhaarCardUrl,imageUrl,
      uniqueId
         } = req.body;
        

        const member = new Member({
          name,mobileNumber, 
          address,
          aadhaarCardUrl:aadhaarCardUrl,
          imageUrl:imageUrl,
          post,
          hostelIds,uniqueId
        });
        await staff.save();
        res.status(201).json(staff);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });


