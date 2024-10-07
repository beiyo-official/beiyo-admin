import React, { useState, useEffect } from 'react';

import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardActions
} from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
import ResidentDetails from './ResidentView';
import ResidentEditForm from './ResidentEditForm';
import SideBar from './Sider';
import api from '../../api/apiKey';

const ResidentList = () => {
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [living, setLiving] = useState('current');

  useEffect(() => {
    // Fetch residents
    api.get('https://beiyo-admin.in/api/newResident')
      .then(response => {
        setResidents(response.data);
        setFilteredResidents(response.data);
      })
      .catch(error => console.error('Error fetching residents:', error));
    
    // Fetch hostels
    api.get('https://beiyo-admin.in/api/hostels')
      .then(response => setHostels(response.data))
      .catch(error => console.error('Error fetching hostels:', error));

    // Fetch rooms
    api.get('https://beiyo-admin.in/api/rooms')
      .then(response => setRooms(response.data))
      .catch(error => console.error('Error fetching rooms:', error));
  }, []);

  useEffect(() => {
    // Filter residents based on selected hostel, room, and living status
    const filtered = residents.filter(resident =>
      (selectedHostel ? resident.hostel === selectedHostel : true) &&
      (selectedRoom ? resident.roomNumber === selectedRoom : true) &&
      (living ? resident.living === living : true)
    );
    setFilteredResidents(filtered);
  }, [selectedHostel, selectedRoom, living, residents]);

  const handleViewDetails = (residentId) => {
    setSelectedResident(residents.find(r => r._id === residentId));
    setOpenDetails(true);
  };

  const handleEdit = (residentId) => {
    setSelectedResident(residents.find(r => r._id === residentId));
    setOpenEdit(true);
  };

  const handleCloseDetails = () => setOpenDetails(false);
  const handleCloseEdit = () => setOpenEdit(false);

  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Resident List</Typography>
      
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Hostel</InputLabel>
            <Select
              value={selectedHostel}
              onChange={(e) => setSelectedHostel(e.target.value)}
              label="Hostel"
            >
              <MenuItem value="">All Hostels</MenuItem>
              {hostels.map(hostel => (
                <MenuItem key={hostel._id} value={hostel.name}>
                  {hostel.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Room</InputLabel>
            <Select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              label="Room"
            >
              <MenuItem value="">All Rooms</MenuItem>
              {rooms.map(room => (
                <MenuItem key={room._id} value={room.roomNumber}>
                  {room.roomNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Living Status</InputLabel>
            <Select
              value={living}
              onChange={(e) => setLiving(e.target.value)}
              label="Living Status"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="current">Current</MenuItem>
              <MenuItem value="old">Old</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {filteredResidents.length === 0 ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {filteredResidents.map(resident => (
            <Grid item xs={12} sm={6} md={4} key={resident._id} >
              <Card>
                <CardContent>
                  <Typography variant="h6">{resident.name}</Typography>
                  <Typography color="textSecondary">Email: {resident.email}</Typography>
                  <Typography color="textSecondary">Mobile Number: {resident.mobileNumber}</Typography>
                  <Typography color="textSecondary">Hostel: {resident.hostel}</Typography>
                  <Typography color="textSecondary">Room Number: {resident.roomNumber}</Typography>
                  <Typography color="textSecondary">Status: {resident.living}</Typography>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleViewDetails(resident._id)}>
                    View Details
                  </IconButton>
                  <IconButton onClick={() => handleEdit(resident._id)}>
                    EditIcon 
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <ResidentDetails
        residentId={selectedResident?._id}
        open={openDetails}
        onClose={handleCloseDetails}
      />

      <ResidentEditForm
        resident={selectedResident}
        open={openEdit}
        onClose={handleCloseEdit}
        onUpdate={(updatedResident) => {
          setResidents(residents.map(r => r._id === updatedResident._id ? updatedResident : r));
          handleCloseEdit();
        }}
      />
    </Box>
    </div>
  );
};

export default ResidentList;
