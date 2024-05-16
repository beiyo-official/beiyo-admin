// src/components/HostelList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HostelForm from './HostelForm';

const HostelList = () => {
  const [hostels, setHostels] = useState([]);
  const [editingHostel, setEditingHostel] = useState(null);

  useEffect(() => {
    axios.get('https://beiyo-admin.vercel.app/api/hostels')
      .then(response => {
        setHostels(response.data);
      })
      .catch(error => {
        console.error('Error fetching hostels:', error);
      });
  }, []);

  const handleEdit = (hostel) => {
    setEditingHostel(hostel);
  };

  const handleFormSubmit = () => {
    setEditingHostel(null);
    axios.get('https://beiyo-admin.vercel.app/api/hostels')
      .then(response => {
        setHostels(response.data);
      })
      .catch(error => {
        console.error('Error fetching hostels:', error);
      });
  };

  return (
    <div>
      <h2>Hostels</h2>
      <ul>
        {hostels.map(hostel => (
          <li key={hostel._id}>
            {hostel.name} - {hostel.location} - {hostel.totalRemainingBeds}
            <button onClick={() => handleEdit(hostel)}>Edit</button>
          </li>
        ))}
      </ul>
      {editingHostel && <HostelForm hostel={editingHostel} onSubmit={handleFormSubmit} />}
      {!editingHostel && <HostelForm onSubmit={handleFormSubmit} />}
    </div>
  );
};

export default HostelList;
