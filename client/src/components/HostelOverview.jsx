import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HostelOverview = () => {
  const [hostelStats, setHostelStats] = useState({ totalHostels: 0, totalBeds: 0, remainingBeds: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://beiyo-admin.in/api/hostels')
      .then(response => {
        const totalHostels = response.data.length;
        const totalBeds = response.data.reduce((acc, hostel) => acc + hostel.totalBeds, 0);
        const remainingBeds = response.data.reduce((acc, hostel) => acc + hostel.totalRemainingBeds, 0);
        setHostelStats({ totalHostels, totalBeds, remainingBeds });
      })
      .catch(error => {
        console.error('Error fetching hostel stats:', error);
      });
  }, []);

  return (
    <Card sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight:'20px', mt: '20px', minWidth:'500px' }}>
      <Typography variant="h5" gutterBottom>
        Hostel Overview
      </Typography>
      <Box>
        <Typography>Total Hostels: {hostelStats.totalHostels}</Typography>
        <Typography>Total Beds: {hostelStats.totalBeds}</Typography>
        <Typography>Remaining Beds: {hostelStats.remainingBeds}</Typography>
      </Box>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2 }}
        onClick={() => navigate('/hostels')}
      >
        Manage Hostels
      </Button>
    </Card>
  );
};

export default HostelOverview;
