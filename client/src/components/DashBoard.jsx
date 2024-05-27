// src/components/Dashboard.js

import React from 'react';
import { Box, CssBaseline } from '@mui/material';

import Header from './Header';
import Sidebar from './Sidebar';
import RoomList from './RoomList';
// import { Link } from 'react-router-dom';
// import { UserButton, useClerk } from '@clerk/clerk-react';

const Dashboard = () => {
  // const { signOut } = useClerk();
  return (
    // <div>
    //   <h1>Admin Dashboard</h1>
    //   <UserButton/>
    //   <p>Welcome to the admin panel. Here you can manage hostels, rooms, and inventory.</p>
    //   <div>
    //     <h2>Quick Links</h2>
    //     <ul>
    //       <li><Link to="/hostels">Manage Hostels</Link></li>
    //       <li><Link to="/rooms">Manage Rooms</Link></li>
    //       <li><Link to="/inventory">Manage Inventory</Link></li>
    //     </ul>
    //   </div>
    //   <button onClick={() => signOut()}>Sign Out</button>
    // </div>
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}
    >
      <Header />
      <RoomList />
    </Box>
  </Box>
  );
};

export default Dashboard;
