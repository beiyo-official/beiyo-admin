// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { config } = require('dotenv');
const PORT = process.env.PORT || 5000;
const cron = require('node-cron');
  const cookieParser = require('cookie-parser');
const cluster = require('cluster');
const hostelRoutes = require('./routes/hostelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const Bed = require('./routes/Bed');
const CleaningSchedule = require('./routes/CleaningShedule');
const newResident = require('./routes/newResident');
const payment = require('./routes/payment')
const login = require('./routes/login')
const Dashboard = require('./routes/DashBoard')
const Staff = require('./routes/Staff')
const Ticket = require('./routes/Tickets');
const Manager = require('./routes/Manager');
const requestForm = require('./routes/requestForm');
const otp = require('./routes/otp');
const { connectDB } = require('./db');
const AppVersion  = require('./routes/appVersion')
const Member = require('./routes/Member')


const app = express();
app.use(cors());
config();
// // Middleware to check API key
app.use((req, res, next) => {
   // Log all headers
  const apiKey = req.query.api; // Extract API key from headers
  if (!apiKey || apiKey !== process.env.SERVER_API_KEY) {
    console.log('API Key is missing or invalid');
    return res.status(403).json({ message: 'Forbidden: Invalid API key' });
  }
  next(); // If API key is valid, proceed to the next middleware/route handler
});


// Middleware
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));

// Increase the limit for URL-encoded requests
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


connectDB();
// updateRoomStatuses();
app.use(cookieParser())

// Routes
app.get("/", (req,res)=>{
  res.json("Welcome to the Beiyo admin backend");
});

app.use('/api/hostels', hostelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/beds',Bed);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/cleaningSchedule', CleaningSchedule);
app.use('/api/pay',payment)
app.use('/api/newResident',newResident)
app.use('/api/login',login)
app.use('/api/dashboard',Dashboard)
app.use('/api/staff', Staff );
app.use('/api/member', Member );
app.use('/api/ticket',Ticket);
app.use('/api/appVersion',AppVersion);
app.use('/api/manager',Manager);
app.use('/api/requestForm',requestForm);
app.use('/api/inventory',inventoryRoutes);
app.use('/api/Otp',otp)


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





