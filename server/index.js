// server.js
const hostelRoutes = require('./routes/hostelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const { connectDB } = require('./db');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { config } = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;
config();
// Middleware
app.use(bodyParser.json());
app.use(cors());
connectDB();


// Routes
app.get("/", (req,res)=>{
  res.json("Welcome to the Beiyo admin backend");
});

app.use('/api/hostels', hostelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/inventory', inventoryRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
