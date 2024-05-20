// src/components/Dashboard.js

import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton, useClerk } from '@clerk/clerk-react';

const Dashboard = () => {
  const { signOut } = useClerk();
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <UserButton/>
      <p>Welcome to the admin panel. Here you can manage hostels, rooms, and inventory.</p>
      <div>
        <h2>Quick Links</h2>
        <ul>
          <li><Link to="/hostels">Manage Hostels</Link></li>
          <li><Link to="/rooms">Manage Rooms</Link></li>
          <li><Link to="/inventory">Manage Inventory</Link></li>
        </ul>
      </div>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default Dashboard;
