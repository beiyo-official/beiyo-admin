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
  const [nearby1distance,setNearby1distance]=useState(hostel?hostel.nearby1distance:'');
  const [nearby2distance,setNearby2distance]=useState(hostel?hostel.nearby2distance:'');
  const [nearby3distance,setNearby3distance]=useState(hostel?hostel.nearby3distance:'');
  const [hostelType,setHostelType]=useState(hostel?hostel.hostelType:'');
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
      nearby1distance,
      nearby2distance,
      nearby3distance
    };
    try {
      if (hostel) {
        await axios.put(`https://beiyo-admin.in/api/hostels/${hostel._id}`, data);
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
            <Select
                   label="HostelType"
                  value={hostelType}
                  onChange={(e)=>setHostelType(e.target.value)}
                  
                >
                  <MenuItem value="">Select Hostel Type</MenuItem>
                  <MenuItem value="single">Boys</MenuItem>
                  <MenuItem value="double">Girls</MenuItem>
                </Select>
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
            label="Nearby Place 1 Distance"
            value={nearby1distance}
            onChange={(e) => setNearby1distance(e.target.value)}
          />
          <TextField
            label="Nearby Place 2"
            value={nearby2}
            onChange={(e) => setNearby2(e.target.value)}
          />
           <TextField
            label="Nearby Place 2 Distance"
            value={nearby2distance}
            onChange={(e) => setNearby2distance(e.target.value)}
          />
          <TextField
            label="Nearby Place 3"
            value={nearby3}
            onChange={(e) => setNearby3(e.target.value)}
          />
           <TextField
            label="Nearby Place 3 Distance"
            value={nearby3distance}
            onChange={(e) => setNearby3distance(e.target.value)}
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



