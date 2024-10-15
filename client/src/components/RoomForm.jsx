



// RoomForm.js
import React, { useState, useEffect } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem
} from '@mui/material';
import api from '../../api/apiKey';

const RoomForm = ({ room, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    capacity: '',
    remainingCapacity: '',
    type: '',
    price: '',
    hostelId: '',
    hostel:''
  });

  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber,
        capacity: room.capacity,
        remainingCapacity: room.remainingCapacity,
        type: room.type,
        price: room.price,
        hostelId: room.hostelId
      });
    }

    api.get('https://beiyo-admin.in/api/hostels')
      .then(response => {
        setHostels(response.data);
      })
      .catch(error => {
        console.error('Error fetching hostels:', error);
      });
  }, [room]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const apiUrl = room ? `https://beiyo-admin.in/api/rooms/${room._id}` : 'https://beiyo-admin.in/api/rooms';
    const method = room ? 'put' : 'post';

    api[method](apiUrl, formData)
      .then(() => {
        onSubmit();
      })
      .catch(error => {
        console.error('Error saving room:', error);
      });
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{room ? 'Edit Room' : 'Add New Room'}</DialogTitle>
      <DialogContent>
        <TextField
          name="roomNumber"
          label="Room Number"
          value={formData.roomNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="capacity"
          label="Capacity"
          type="number"
          value={formData.capacity}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="remainingCapacity"
          label="Remaining Capacity"
          type="number"
          value={formData.remainingCapacity}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="type"
          label="Type"
          select
          value={formData.type}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="single">Single</MenuItem>
          <MenuItem value="double">Double</MenuItem>
          <MenuItem value="triple">Triple</MenuItem>
           <MenuItem value="four-sharing">four-sharing</MenuItem>
        </TextField>
        <TextField
          name="price"
          label="Price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="hostelId"
          label="Hostel"
          select
          value={formData.hostelId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {hostels.map(hostel => (
            <MenuItem key={hostel._id} value={hostel._id}>
              {hostel.name}
            </MenuItem>
          ))}
        </TextField>
 <TextField
          name="hostel"
          label="HostelName"
          select
          value={formData.hostel}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {hostels.map(hostel => (
            <MenuItem key={hostel._id} value={hostel.name}>
              {hostel.name}
            </MenuItem>
          ))}
        </TextField>
        <Button onClick={handleSubmit} variant="contained" color="primary" style={{ marginTop: '16px' }}>
          Save
        </Button>
        <Button onClick={onClose} variant="outlined" color="secondary" style={{ marginTop: '16px' }}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RoomForm;


