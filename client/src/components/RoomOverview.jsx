import { Card, Typography, Button, Box } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const RoomOverview = () => {
    const [roomStats, setRoomStats] = useState({ totalrooms: 0, totalBeds: 0, remainingBeds: 0 });
    const navigate = useNavigate();
  
    useEffect(() => {
      axios.get('https://beiyo-admin.in/api/rooms')
        .then(response => {
          const totalrooms = response.data.length;
          const totalBeds = response.data.reduce((acc, room) => acc + room.capacity, 0);
          const remainingBeds = response.data.reduce((acc, room) => acc + room.remainingCapacity, 0);
          setRoomStats({ totalrooms, totalBeds, remainingBeds });
        })
        .catch(error => {
          console.error('Error fetching room stats:', error);
        });
    }, []);
  
  return (
    <div>
         <Card sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight:'20px', mt: '20px', minWidth:'500px' }}>
      <Typography variant="h5" gutterBottom>
        room Overview
      </Typography>
      <Box>
        <Typography>Total rooms: {roomStats.totalrooms}</Typography>
        <Typography>Total Beds: {roomStats.totalBeds}</Typography>
        <Typography>Remaining Beds: {roomStats.remainingBeds}</Typography>
      </Box>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2 }}
        onClick={() => navigate('/rooms')}
      >
        Manage Rooms
      </Button>
    </Card>
    </div>
  )
}

export default RoomOverview