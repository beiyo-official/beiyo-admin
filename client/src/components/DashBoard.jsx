// src/components/Dashboard.js

import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel. Here you can manage hostels, rooms, and inventory.</p>
      <div>
        <h2>Quick Links</h2>
        <ul>
          <li><Link to="/hostels">Manage Hostels</Link></li>
          <li><Link to="/rooms">Manage Rooms</Link></li>
          <li><Link to="/inventory">Manage Inventory</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
