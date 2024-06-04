import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography, MenuItem, Select, CssBaseline } from '@mui/material';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const CleaningChart = () => {
  const { hostelId } = useParams();
  const [schedule, setSchedule] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(dayjs().format('YYYY-MM')); 
  const [hostel, setHostel] = useState({});
  
  // Fetch rooms for the specific hostel
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`https://beiyo-admin.vercel.app/api/rooms`);
        const allRooms = response.data;
        const specificHostelRooms = allRooms.filter(room => room.hostelId === hostelId);
        // console.log(specificHostelRooms);
        setRooms(specificHostelRooms);
      } catch (error) {
        console.error('Error fetching room numbers:', error);
      }
    };
    fetchRooms();
  }, [hostelId]);

  // Fetch hostel details
  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const response = await axios.get(`https://beiyo-admin.vercel.app/api/hostels/${hostelId}`);
        setHostel(response.data); 
      } catch (error) {
        console.error('Error fetching hostel details:', error);
      }
    };
    fetchHostel();
  }, [hostelId]);

  // Fetch cleaning schedule for the specified month
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://beiyo-admin.vercel.app/api/cleaningSchedule/hostels/${hostelId}/cleaning-schedule`);
        setSchedule(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching cleaning schedule:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [hostelId, month]);

  // Handle checkbox change for cleaning status
  const handleCheckboxChange = (date, roomNumber) => {
    const entry = schedule.find(e => e.date === date && e.roomNumber === roomNumber);
    const cleaned = entry ? !entry.cleaned : true;
    
    const updatedSchedule = entry
      ? schedule.map(e => e.date === date && e.roomNumber === roomNumber ? { ...e, cleaned } : e)
      : [...schedule, { hostelId, date, roomNumber, cleaned }];
    
    setSchedule(updatedSchedule);

    axios.post(`https://beiyo-admin.vercel.app/api/cleaningSchedule/hostels/${hostelId}/cleaning-schedule`, { date, roomNumber, cleaned })
      .catch(error => {
        console.error('Error updating cleaning schedule:', error);
      });
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(schedule)) {
    console.error('Error: schedule is not an array:', schedule);
    return <div>Error loading cleaning schedule</div>;
  }

  const daysInMonth = dayjs(month).daysInMonth();

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', mt:'5vh' }}>
      <CssBaseline/>
      <Typography variant="h4" gutterBottom>
        Cleaning Chart for Hostel {hostel.name}
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Select Month:</Typography>
        <Select
          value={month}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const monthValue = dayjs().month(i).format('YYYY-MM');
            return (
              <MenuItem key={monthValue} value={monthValue}>
                {dayjs().month(i).format('MMMM YYYY')}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date / Room no.</TableCell>
              {rooms.map(room => (
                <TableCell key={room._id} align="center">{room.roomNumber}</TableCell>
              ))} 
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: daysInMonth }, (_, i) => {
              const date = dayjs(month).date(i + 1).format('DD-MM-YYYY');
              return (
                <TableRow key={date}>
                  <TableCell component="th" scope="row">
                    {date}
                  </TableCell>
                  {rooms.map(room => {
                    const entry = schedule.find(e => e.date === date && e.roomNumber === room.roomNumber);
                    return (
                      <TableCell key={room._id} align="center">
                        <Checkbox
                          checked={entry ? entry.cleaned : false}
                          onChange={() => handleCheckboxChange(date, room.roomNumber)}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CleaningChart;
