import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const ResidentEditForm = ({ resident, open, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(null);
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && resident) {
      setLoading(true);
      setFormData({ ...resident });
      
      // Fetch hostels and rooms for selection
      axios.get('https://beiyo-admin.in/api/hostels')
        .then(response => setHostels(response.data))
        .catch(error => console.error('Error fetching hostels:', error));

      axios.get('https://beiyo-admin.in/api/rooms')
        .then(response => setRooms(response.data))
        .catch(error => console.error('Error fetching rooms:', error));

      setLoading(false);
    }
  }, [open, resident]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData) {
      axios.put(`https://beiyo-admin.in/api/newResident/${formData._id}`, formData)
        .then(response => {
          onUpdate(response.data);
        })
        .catch(error => console.error('Error updating resident:', error));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Resident</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              label="Name"
              name="name"
              value={formData?.name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formData?.email || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              value={formData?.mobileNumber || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              name="address"
              value={formData?.address || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Parents' Name"
              name="parentsName"
              value={formData?.parentsName || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Parents' Mobile No"
              name="parentsMobileNo"
              value={formData?.parentsMobileNo || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Rent"
              name="rent"
              type="number"
              value={formData?.rent || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            {/* Add other fields as needed */}
            <TextField
              label="Living"
              name="living"
              type="text"
              value={formData?.living || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSubmit} color="secondary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResidentEditForm;
