// server.js
const hostelRoutes = require('./routes/hostelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const Bed = require('./routes/Bed');
const CleaningSchedule = require('./routes/CleaningShedule');
const payment = require('./routes/payment')
const { connectDB } = require('./db');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { config } = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;
const cron = require('node-cron');

config();
// Middleware
app.use(bodyParser.json());
app.use(cors());
connectDB();
// updateRoomStatuses();
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'https://www.beiyo.in');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

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


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
