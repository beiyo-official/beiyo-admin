// Backend (Node.js/Express)
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const Resident = require('../models/newMemberResident'); // Your Resident model
const router = express.Router();

 router.post('/',async(req,res)=>{
    try {
        const {studentData} = req.query
    const newResident = new Resident(JSON.parse(studentData));
    await newResident.save();
    } catch (error) {
        res.json(error);
    }
    
 })
    // Payment successful, save user data
    module.exports = router;

  