  const express = require('express');
  const router = express.Router();
  const Member = require('../models/Member');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  router.post('/', async (req, res) => {
      try {
        const { name,
          mobileNumber,
          //  address,
           email,
        post,
        password,
          // aadhaarCardUrl,imageUrl,
      uniqueId
         } = req.body;
        

        const member = new Member({
          name,
          mobileNumber,
          //  address,
           email,
        post,
        password,
          // aadhaarCardUrl,imageUrl,
      uniqueId
        });
        await member.save();
        res.status(201).json(member);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

router.get('/', async (req, res) => {
      try {
        const Members = await Member.find();
        res.json(Members);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  router.post('/login',async(req,res)=>{
    const { uniqueId, password } = req.body;

    try {
      const user = await Member.findOne({ uniqueId });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET , { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
      // res.cookie('user', user, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
      res.json({ token });
    } catch (error) {
      res.status(500).send(error);
      console.log(error);
    }
  })  
  router.get('/:memberId',async(req,res)=>{
    try {
      const  member = await Member.findById(req.params.memberId);
      res.json(member);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })



module.exports = router;
    




