// Backend (Node.js/Express)
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const Resident = require('./models/Resident'); // Your Resident model
const router = express.Router();

 router.post('/api/newStudent',async(req,res)=>{
    const {studentData} = req.body
    const newResident = new Resident(JSON.parse(studentData));
    await newResident.save();
 })
    // Payment successful, save user data
   
  