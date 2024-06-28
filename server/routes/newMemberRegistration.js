// // Backend (Node.js/Express)
// const express = require('express');
// const mongoose = require('mongoose');
// const nodemailer = require('nodemailer');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const aws = require('aws-sdk');
// const Resident = require('./models/Resident'); // Your Resident model
// const router = express.Router();


// // const accountSid = 'your_twilio_account_sid'; // Your Twilio SID
// // const authToken = 'your_twilio_auth_token'; // Your Twilio Auth Token
// // const client = twilio(accountSid, authToken);

// // aws.config.update({
// //     secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',
// //     accessKeyId: 'YOUR_AWS_ACCESS_KEY_ID',
// //     region: 'YOUR_AWS_REGION', // e.g., 'us-east-1'
// //   });






// const generateUniqueId = (roomNumber) => {
//   return `BE${roomNumber}`;
// };

// // Configure multer with S3 storage
// const upload = multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: 'YOUR_BUCKET_NAME',
//       acl: 'public-read',
//       key: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//       }
//     })
//   });



// // router.post('/api/send-otp', async (req, res) => {
// //   const { mobileNumber } = req.body;

// //   try {
// //     const otp = Math.floor(100000 + Math.random() * 900000).toString();

// //     await client.messages.create({
// //       body: `Your OTP is ${otp}`,
// //       from: 'your_twilio_phone_number',
// //       to: mobileNumber,
// //     });

// //     // Store OTP in session or use a temporary store
// //     req.session.otp = otp; // Assuming session middleware is used

// //     res.sendStatus(200);
// //   } catch (error) {
// //     res.status(500).send('Failed to send OTP');
// //   }
// // });

// router.post('/api/register-resident', upload.fields([{ name: 'photo' }, { name: 'aadharCard' },{name:'signedDocuments'}]), async (req, res) => {
//     const { name, email, mobileNumber, roomNumber, hostel, parentsName, parentsMobileNo,address,intitutionDetails} = req.body;
//     const photoUrl = req.files.photo[0].location;
//     const aadharCardUrl = req.files.aadharCard[0].location;
//     const signedDocumentsUrl = req.files.signedDocuments[0].location;
//     const uniqueId = generateUniqueId(roomNumber);

  
//     // if (req.session.otp !== otp) {
//     //   return res.status(401).send('Invalid OTP');
//     // }
  
//     const newResident = new Resident({
//       name,
//       email,
//       address,
//       mobileNumber,
//       roomNumber,
//       uniqueId,
//       photo: photoUrl,
//       aadharCard: aadharCardUrl,
//       signedDocuments:signedDocumentsUrl,
//       intitutionDetails,
//       parentsMobileNo,
//       parentsName,
//       hostel,


//     });
  
//     try {
//       await newResident.save();
  
//       // Send unique ID via email
//       await sendUniqueIdEmail(email, uniqueId);
  
//       res.status(201).send('Resident registered and unique ID sent');
//     } catch (error) {
//       res.status(400).send('Registration failed');
//     }
//   });

// const sendUniqueIdEmail = async (email, uniqueId) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: '',
//       pass: '',
//     },
//   });

//   const mailOptions = {
//     from: 'your-email@gmail.com',
//     to: email,
//     subject: 'Your Unique ID for Beiyo Hostel',
//     text: `Your unique ID is: ${uniqueId}`,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = router;
