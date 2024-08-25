import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomForm from './RoomForm';
import { Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Dialog, DialogTitle, DialogContent, DialogActions, CssBaseline } from '@mui/material';
import { useUser } from '@clerk/clerk-react';
import UpdateBedsForm from './UpdateBedsForm';
import { Link, Navigate } from 'react-router-dom';

const RoomList = () => {
  const { user } = useUser();
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortByPrice, setSortByPrice] = useState('all');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    availability: 'all',
    type: 'all',
    capacity: 'all',
    hostel: 'all',
  });
  const [isUpdateBedsFormOpen, setIsUpdateBedsFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const handleUpdateBedsSubmit = () => {
    // Handle beds update submission (e.g., refetch data)
    setIsUpdateBedsFormOpen(false);
    axios.get('http://13.233.120.199:5000/api/rooms')
    .then(response => {
      setRooms(response.data);
      setFilteredRooms(response.data);
    })
    .catch(error => {
      console.error('Error fetching rooms:', error);
    });
  };

  useEffect(() => {
    let filtered = rooms.filter(room => {
      let match = true;

      if (priceFilter !== 'all') {
        switch (priceFilter) {
          case 'less-than-3000':
            match = room.price < 3000;
            break;
          case 'less-than-4000':
            match = room.price < 4000;
            break;
          case 'less-than-5000':
            match = room.price < 5000;
            break;
          case 'greater-than-3000':
            match = room.price > 3000;
            break;
          case 'greater-than-4000':
            match = room.price > 4000;
            break;
          case 'greater-than-5000':
            match = room.price > 5000;
            break;
          default:
            break;
        }
      }

      return match;
    });

    switch (sortByPrice) {
      case 'low-to-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'high-to-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredRooms(filtered);
  }, [rooms, filterOptions, priceFilter, sortByPrice]);

  useEffect(() => {
    axios.get('https://beiyo-admin.vercel.app/api/rooms')
      .then(response => {
        setRooms(response.data);
        setFilteredRooms(response.data);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });

    axios.get('https://beiyo-admin.vercel.app/api/hostels')
      .then(response => {
        setHostels(response.data);
      })
      .catch(error => {
        console.error('Error fetching hostels:', error);
      });
  }, []);

  useEffect(() => {
    let filtered = rooms.filter(room => {
      let match = true;
      if (filterOptions.availability !== 'all') {
        if (filterOptions.availability === 'empty') {
          match = room.remainingCapacity > 0;
        } else {
          match = room.remainingCapacity === 0;
        }
      }
      if (match && filterOptions.type !== 'all') {
        match = room.type === filterOptions.type;
      }
      if (match && filterOptions.capacity !== 'all') {
        match = room.capacity === parseInt(filterOptions.capacity);
      }
      if (match && filterOptions.hostel !== 'all') {
        match = room.hostelId === filterOptions.hostel;
      }
      return match;
    });
    setFilteredRooms(filtered);
  }, [rooms, filterOptions]);

  const handleFormSubmit = () => {
    setOpenForm(false);
    axios.get('https://beiyo-admin.vercel.app/api/rooms')
      .then(response => {
        setRooms(response.data);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions({
      ...filterOptions,
      [name]: value,
    });
  };

  

  const handleSearch = () => {
    const filtered = rooms.filter(room =>
      room.hostel.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    setFilteredRooms(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const handleRoomClick = (roomId) => {
    Navigate(`/rooms/${roomId}/beds`);
  };

  return (
    <Box sx={{mt:'7vh'}}>
      <CssBaseline/>
      <Typography variant="h4" gutterBottom>
        Rooms
      </Typography>
      <Button  variant="contained" color="primary" onClick={() => setOpenForm(true)}>
        Add New Room
      </Button>
      <Grid mt={'1rem'} container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Search by hostel name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Availability</InputLabel>
            <Select
              name="availability"
              value={filterOptions.availability}
              onChange={handleFilterChange}
              label="Availability"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="empty">Empty</MenuItem>
              <MenuItem value="full">Full</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Room Type</InputLabel>
            <Select
              name="type"
              value={filterOptions.type}
              onChange={handleFilterChange}
              label="Room Type"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="single">Single</MenuItem>
              <MenuItem value="double">Double</MenuItem>
              <MenuItem value="triple">Triple</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Capacity</InputLabel>
            <Select
              name="capacity"
              value={filterOptions.capacity}
              onChange={handleFilterChange}
              label="Capacity"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Hostel</InputLabel>
            <Select
              name="hostel"
              value={filterOptions.hostel}
              onChange={handleFilterChange}
              label="Hostel"
            >
              <MenuItem value="all">All</MenuItem>
              {hostels.map((hostel) => (
                <MenuItem key={hostel._id} value={hostel._id}>
                  {hostel.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Price</InputLabel>
            <Select
              name="priceFilter"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              label="Price"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="less-than-3000">Less than 3000</MenuItem>
              <MenuItem value="less-than-4000">Less than 4000</MenuItem>
              <MenuItem value="less-than-5000">Less than 5000</MenuItem>
              <MenuItem value="greater-than-3000">Greater than 3000</MenuItem>
              <MenuItem value="greater-than-4000">Greater than 4000</MenuItem>
              <MenuItem value="greater-than-5000">Greater than 5000</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Sort by Price</InputLabel>
            <Select
              name="sortByPrice"
              value={sortByPrice}
              onChange={(e) => setSortByPrice(e.target.value)}
              label="Sort by Price"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="low-to-high">Low to High</MenuItem>
              <MenuItem value="high-to-low">High to Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ height: '100%' }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <Box>
        <Grid container spacing={2}>
          {filteredRooms.map((room) => (
            <Grid  item key={room._id} xs={12} sm={6} md={4}>
             
              <Box 
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#fff',
                  display:'flex',
                  flexDirection:'column'
                }}
              >
                <Typography variant="h6">{room.roomNumber}</Typography>
                <Typography variant="h6">{room.hostel}</Typography>
                <Typography>Room Type: {room.type}</Typography>
                <Typography>Capacity: {room.capacity}</Typography>
                <Typography>Remaining Capacity: {room.remainingCapacity}</Typography>
                <Typography>Price: {room.price}</Typography>
                <Typography>Last Cleaned: {formatDate(room.lastCleanedAt)}</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSelectedRoom(room);
                    setIsUpdateBedsFormOpen(true);
                  }}
                  sx={{ mt: 1 }}
                >
                  Update Beds
                </Button>
                <Dialog open={isUpdateBedsFormOpen} onClose={() => setIsUpdateBedsFormOpen(false)}>
                {isUpdateBedsFormOpen && (
        <UpdateBedsForm
          room={selectedRoom}
          onSubmit={handleUpdateBedsSubmit}
          onClose={() => setIsUpdateBedsFormOpen(false)}
        />
      )}
                </Dialog>
                <a style={{color:'white'}} href={`/rooms/${room._id}/beds`}>
               <Button    variant="contained"
                  color="secondary"
                  sx={{ mt: 1 }} > See Beds</Button></a>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <RoomForm  hostels={hostels} onClose={() => setOpenForm(false)} onSubmit={handleFormSubmit} />
      </Dialog>
    </Box>
  );
};

export default RoomList;
