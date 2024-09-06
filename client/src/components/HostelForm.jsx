// src/components/HostelForm.js

import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CssBaseline,
  Grid
} from '@mui/material';

const HostelForm = ({ hostel, onSubmit, onClose }) => {
  const [name, setName] = useState(hostel ? hostel.name : '');
  const [location, setLocation] = useState(hostel ? hostel.location : '');
  const [locationLink, setLocationLink] = useState(hostel ? hostel.locationLink : '');
  const [price, setPrice] = useState(hostel ? hostel.price : '');
  const [image, setImage] = useState(hostel ? hostel.image : '');
  const [image2, setImage2] = useState(hostel ? hostel.image2 : '');
  const [image3, setImage3] = useState(hostel ? hostel.image3 : '');
  const [single, setSingle] = useState(hostel ? hostel.single : false);
  const [singlePrice, setSinglePrice] = useState(hostel ? hostel.singlePrice : '');
  const [doublePrice, setDoublePrice] = useState(hostel ? hostel.doublePrice : '');
  const [triplePrice, setTriplePrice] = useState(hostel ? hostel.triplePrice : '');
  const [nearby1, setNearby1] = useState(hostel ? hostel.nearby1 : '');
  const [nearby2, setNearby2] = useState(hostel ? hostel.nearby2 : '');
  const [nearby3, setNearby3] = useState(hostel ? hostel.nearby3 : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      location,
      locationLink,
      price,
      image,
      image2,
      image3,
      single,
      singlePrice,
      doublePrice,
      triplePrice,
      nearby1,
      nearby2,
      nearby3,
    };
    try {
      if (hostel) {
        await axios.patch(`https://beiyo-admin.in/api/hostels/${hostel._id}`, data);
      } else {
        await axios.post('https://beiyo-admin.in/api/hostels', data);
      }
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Error saving hostel:', error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <CssBaseline />
      <DialogTitle>{hostel ? 'Update Hostel' : 'Add Hostel'}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{  display:'flex', flexDirection:'column',mt: 2 , gap:'2rem', width:'30rem'}}
         spacing={4}
         xs={2}
          onSubmit={handleSubmit}
        >
          <TextField 
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <TextField
            label="Location Link"
            value={locationLink}
            onChange={(e) => setLocationLink(e.target.value)}
            required
          />
          <TextField
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <TextField
            label="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
          <TextField
            label="Image 2 URL"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
          />
          <TextField
            label="Image 3 URL"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={single}
                onChange={(e) => setSingle(e.target.checked)}
              />
            }
            label="Single"
          />
          <TextField
            label="Single Price"
            value={singlePrice}
            onChange={(e) => setSinglePrice(e.target.value)}
          />
          <TextField
            label="Double Price"
            value={doublePrice}
            onChange={(e) => setDoublePrice(e.target.value)}
          />
          <TextField
            label="Triple Price"
            value={triplePrice}
            onChange={(e) => setTriplePrice(e.target.value)}
          />
          <TextField
            label="Nearby Place 1"
            value={nearby1}
            onChange={(e) => setNearby1(e.target.value)}
          />
          <TextField
            label="Nearby Place 2"
            value={nearby2}
            onChange={(e) => setNearby2(e.target.value)}
          />
          <TextField
            label="Nearby Place 3"
            value={nearby3}
            onChange={(e) => setNearby3(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {hostel ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HostelForm;
