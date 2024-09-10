// HostelList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HostelForm from './HostelForm';

import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CssBaseline
} from '@mui/material';
import ResidentDetails from './ResidentView';

const HostelList = () => {
  const [hostels, setHostels] = useState([]);
  const [editingHostel, setEditingHostel] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);
  const [openResidentDetail, setOpenResidentDetail] = useState(false);
  
  useEffect(() => {
    axios.get('https://beiyo-admin.in/api/hostels')
      .then(response => {
        setHostels(response.data);
      })
      .catch(error => {
        console.error('Error fetching hostels:', error);
      });
  }, []);

  const handleEdit = (hostel) => {
    setEditingHostel(hostel);
    setOpenForm(true);
  };

  const handleViewDetails = async (hostel) => {
    setSelectedHostel(hostel);
    setOpenDetail(true);

    // Fetch resident details based on resident IDs in the hostel
    if (hostel.residents && hostel.residents.length > 0) {
      try {
        const residentIds = hostel.residents.join(','); // Assuming the resident IDs are in an array
        const response = await axios.get(`https://beiyo-admin.in/api/newResident/allResidentIds?ids=${residentIds}`);
        setResidents(response.data); // Assuming the API returns the resident details
      } catch (error) {
        console.error('Error fetching residents:', error);
      }
    } else {
      setResidents([]); // If no residents, clear the previous resident data
    }
  };

  const handleFormSubmit = () => {
    setEditingHostel(null);
    setOpenForm(false);
    axios.get('https://beiyo-admin.in/api/hostels')
      .then(response => {
        setHostels(response.data);
      })
      .catch(error => {
        console.error('Error fetching hostels:', error);
      });
  };

  const handleViewResidentDetails = (resident) => {
    setSelectedResident(resident);
    setOpenResidentDetail(true);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <CssBaseline />
      <Typography variant="h4" gutterBottom>
        Hostels
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
        Add New Hostel
      </Button>
      <Grid container spacing={3} mt={2}>
        {hostels.map(hostel => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={hostel._id}>
            <Card sx={{ minHeight: '200px', display: 'flex', flexDirection: 'column'}}>
              <CardContent sx={{display:'flex',flexDirection:'column' ,gap:1}} >
                <Typography variant="h6" component="div">
                  {hostel.name}
                </Typography>
                <Typography color="text.secondary">
                  Location: {hostel.location}
                </Typography>
                <Typography color="text.secondary">
                  Remaining Beds: {hostel.totalRemainingBeds}
                </Typography>
                <Typography color="text.secondary">
                  Price: {hostel.price}
                </Typography>
                <Box sx={{display:'flex',gap:2}}>
                  <Button variant="contained" color="secondary" onClick={() => handleEdit(hostel)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="info" onClick={() => handleViewDetails(hostel)}>
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <HostelForm hostel={editingHostel} onSubmit={handleFormSubmit} onClose={() => setOpenForm(false)} />
      </Dialog>

      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle>Hostel Details</DialogTitle>
        <DialogContent>
          {selectedHostel && (
            <Box>
              <Typography variant="h6">{selectedHostel.name}</Typography>
              <Typography color="text.secondary">
                Type: {selectedHostel.hostelType}
              </Typography>
              <Typography color="text.secondary">
                Location: {selectedHostel.location}
              </Typography>
              <Typography color="text.secondary">
                Price: {selectedHostel.price}
              </Typography>
              <Typography color="text.secondary">
                Single Price: {selectedHostel.singlePrice}
              </Typography>
              <Typography color="text.secondary">
                Double Price: {selectedHostel.doublePrice}
              </Typography>
              <Typography color="text.secondary">
                Triple Price: {selectedHostel.triplePrice}
              </Typography>
              <Typography color="text.secondary">
                Nearby Locations:
                <ul>
                  {selectedHostel.nearby1 && <li>{selectedHostel.nearby1} - {selectedHostel.nearby1distance}</li>}
                  {selectedHostel.nearby2 && <li>{selectedHostel.nearby2} - {selectedHostel.nearby2distance}</li>}
                  {selectedHostel.nearby3 && <li>{selectedHostel.nearby3} - {selectedHostel.nearby3distance}</li>}
                </ul>
              </Typography>
              <Typography color="text.secondary">
                Total Beds: {selectedHostel.totalBeds}
              </Typography>
              <Typography color="text.secondary">
                Total Remaining Beds: {selectedHostel.totalRemainingBeds}
              </Typography>
              <Typography color="text.secondary">
                Total Rooms: {selectedHostel.totalRooms}
              </Typography>
              <Typography color="text.secondary">
                Total Tenants: {selectedHostel.totalTenants}
              </Typography>
              <Typography color="text.secondary">
                Map Link: <a href={selectedHostel.mapLink} target="_blank" rel="noopener noreferrer">View on Map</a>
              </Typography>
              <Typography color="text.secondary">
                Location Link: <a href={selectedHostel.locationLink} target="_blank" rel="noopener noreferrer">View Location</a>
              </Typography>

              {/* Displaying resident names with view details button */}
              <Typography variant="h6" gutterBottom>
                Residents:
              </Typography>
              {residents.length > 0 ? (
                <ul>
                  {residents.map((resident) => (
                    <li key={resident._id}>
                      {resident.name}
                      <Button variant="contained" color="info" onClick={() => handleViewResidentDetails(resident)}>
                        View Details
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography color="text.secondary">
                  No residents available.
                </Typography>
              )}

              <Box sx={{ mt: 2 }}>
                {selectedHostel.image && <img src={selectedHostel.image} alt={`${selectedHostel.name} - 1`} style={{ width: '100%', height: 'auto' }} />}
                {selectedHostel.image2 && <img src={selectedHostel.image2} alt={`${selectedHostel.name} - 2`} style={{ width: '100%', height: 'auto', marginTop: '10px' }} />}
                {selectedHostel.image3 && <img src={selectedHostel.image3} alt={`${selectedHostel.name} - 3`} style={{ width: '100%', height: 'auto', marginTop: '10px' }} />}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ResidentDetails
        residentId={selectedResident?._id}
        open={openResidentDetail}
        onClose={() => setOpenResidentDetail(false)}
      />
    </Box>
  );
};

export default HostelList;
