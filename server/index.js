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
const Manager = require('./routes/Manager')
const { connectDB } = require('./db');
const AppVersion  = require('./routes/appVersion')



const app = express();
app.use(cors(

));
config();
// Middleware
app.use(bodyParser.json());

connectDB();``
// updateRoomStatuses();
app.use(cookieParser())

// Routes
app.get("/", (req,res)=>{
  res.json("Welcome to the Beiyo admin backend");
});

app.use('/api/hostels', hostelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/beds',Bed)
app.use('/api/inventory', inventoryRoutes);
app.use('/api/cleaningSchedule', CleaningSchedule);
app.use('/api/pay',payment)
app.use('/api/newResident',newResident)
app.use('/api/login',login)
app.use('/api/dashboard',Dashboard)
app.use('/api/staff', Staff );
app.use('/api/ticket',Ticket);
app.use('/api/appVersion',AppVersion);
app.use('/api/manager',Manager);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





