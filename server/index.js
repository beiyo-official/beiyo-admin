// // server.js

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { config } = require('dotenv');

// const PORT = process.env.PORT || 5000;
// const cron = require('node-cron');
// const cookieParser = require('cookie-parser');
// const cluster = require('cluster');

// const hostelRoutes = require('./routes/hostelRoutes');
// const roomRoutes = require('./routes/roomRoutes');
// const inventoryRoutes = require('./routes/inventoryRoutes');
// const Bed = require('./routes/Bed');
// const CleaningSchedule = require('./routes/CleaningShedule');
// const newResident = require('./routes/newResident');
// const payment = require('./routes/payment')
// const login = require('./routes/login')
// const Dashboard = require('./routes/DashBoard')
// const { connectDB } = require('./db');




// const app = express();

// config();
// // Middleware
// app.use(bodyParser.json());
// app.use(cors());
// connectDB();``
// // updateRoomStatuses();
// app.use(cookieParser())

// // Routes
// app.get("/", (req,res)=>{
//   res.json("Welcome to the Beiyo admin backend");
// });

// app.use('/api/hostels', hostelRoutes);
// app.use('/api/rooms', roomRoutes);
// app.use('/api/beds',Bed)
// app.use('/api/inventory', inventoryRoutes);
// app.use('/api/cleaningSchedule', CleaningSchedule);
// app.use('/api/pay',payment)
// app.use('/api/newResident',newResident)
// app.use('/api/login',login)
// app.use('/api/dashboard',Dashboard)

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });






const cluster = require('cluster');
const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const { config } = require('dotenv');
const { connectDB } = require('./db');

const hostelRoutes = require('./routes/hostelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const Bed = require('./routes/Bed');
const CleaningSchedule = require('./routes/CleaningShedule');
const newResident = require('./routes/newResident');
const payment = require('./routes/payment');
const login = require('./routes/login');
const Dashboard = require('./routes/DashBoard');

config();

if (cluster.isMaster) {
  // const numCPUs = os.cpus().length;

  console.log(`Master ${process.pid} is running`);

  // Fork workers

    cluster.fork();
  

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {
  // Workers can share any TCP connection
  const app = express();
  const PORT = process.env.PORT || 5000;

  // Middleware
  app.use(bodyParser.json());
  app.use(cors());
  app.use(cookieParser());

  // Connect to database
  connectDB();

  // Routes
  app.get("/", (req, res) => {
    res.json("Welcome to the Beiyo admin backend");
  });

  app.use('/api/hostels', hostelRoutes);
  app.use('/api/rooms', roomRoutes);
  app.use('/api/beds', Bed);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/cleaningSchedule', CleaningSchedule);
  app.use('/api/pay', payment);
  app.use('/api/newResident', newResident);
  app.use('/api/login', login);
  app.use('/api/dashboard', Dashboard);

  // Start the server
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
}
