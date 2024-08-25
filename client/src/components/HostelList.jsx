// src/components/HostelList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HostelForm from './HostelForm';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Dialog,
  CssBaseline
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
const HostelList = () => {
  const [hostels, setHostels] = useState([]);
  const [editingHostel, setEditingHostel] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://13.233.120.199:5000/api/hostels')
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

  const handleFormSubmit = () => {
    setEditingHostel(null);
    setOpenForm(false);
    axios.get('https://beiyo-admin.vercel.app/api/hostels')
      .then(response => {
        setHostels(response.data);
      })
      .catch(error => {
        console.error('Error fetching hostels:', error);
      });
  };
  const handleViewCleaningChart = (hostelId) => {
    navigate(`/hostels/${hostelId}/cleaning-chart`);
  };

  return (<>
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh',mt:'5vh',width:'100%' }}>
      <CssBaseline />
      <Typography variant="h4" gutterBottom>
        Hostels
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
        Add New Hostel
      </Button>
      <List>
        {hostels.map(hostel => (
          <ListItem key={hostel._id} sx={{ border: '1px solid #ccc', borderRadius: 2, mb: 2 ,display:'flex', gap:'2rem' }}>
            <ListItemText
              primary={hostel.name}
              secondary={`Location: ${hostel.location}, Remaining Beds: ${hostel.totalRemainingBeds}, Single: ${hostel.single} ,Price : ${hostel.price}`}
            />
            <Button variant="contained" color="secondary" onClick={() => handleEdit(hostel)}>
              Edit
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleViewCleaningChart(hostel._id,hostel.name)}>
              View Cleaning Chart
            </Button>
          </ListItem>
        ))}
      </List>
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <HostelForm hostel={editingHostel} onSubmit={handleFormSubmit} onClose={() => setOpenForm(false)} />
      </Dialog>
    </Box>
    </>
  );
};

export default HostelList;
