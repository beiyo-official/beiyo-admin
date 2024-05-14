// src/components/HostelForm.js

import React, { useState } from 'react';
import axios from 'axios';

const HostelForm = ({ hostel, onSubmit }) => {
  const [name, setName] = useState(hostel ? hostel.name : '');
  const [location, setLocation] = useState(hostel ? hostel.location : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      location,
    };
    if (hostel) {
      await axios.patch(`https://beiyo-admin.vercel.app/api/hostels/${hostel._id}`, data);
    } else {
      await axios.post('https://beiyo-admin.vercel.app/api/hostels', data);
    }
    onSubmit();
  };

  const handleDelete = async () => {
    await axios.delete(`https://beiyo-admin.vercel.app/api/hostels/${hostel._id}`);
    onSubmit();
  };

  return (
    <div>
      <h2>{hostel ? 'Update Hostel' : 'Add Hostel'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <button type="submit">{hostel ? 'Update' : 'Add'}</button>
        {hostel && <button onClick={handleDelete}>Delete</button>}
      </form>
    </div>
  );
};

export default HostelForm;
