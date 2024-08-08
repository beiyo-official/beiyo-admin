
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CssBaseline,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
} from '@mui/material';
// import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { format } from 'date-fns';



const NewResidentList = () => {
  const [residents, setResidents] = useState([]);
  const [filteredResident, setFilteredResident] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [payments, setPayments] = useState({});
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [openResidents, setOpenResidents] = useState({});

  useEffect(() => {
    axios
      .get('https://beiyo-admin.vercel.app/api/hostels')
      .then((response) => {
        setHostels(response.data);
      })
      .catch((error) => {
        console.error('Error fetching hostels:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get('https://beiyo-admin.vercel.app/api/newResident')
      .then((response) => {
        const residentData = response.data;
        setResidents(residentData);
        setFilteredResident(residentData);
      })
      .catch((error) => {
        console.error('Error fetching residents:', error);
      });
  }, []);

  const handleHostelChange = (event) => {
    const selected = event.target.value;
    setSelectedHostel(selected);
    const filtered = residents.filter(
      (resident) => resident.hostel === selected || selected === ''
    );
    setFilteredResident(filtered);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleTogglePayments = async (residentId) => {
    setOpenResidents((prevOpenResidents) => ({
      ...prevOpenResidents,
      [residentId]: !prevOpenResidents[residentId],
    }));

    // Load payments when opening
    if (!payments[residentId] && !openResidents[residentId]) {
      try {
        const response = await axios.get(
          `https://beiyo-admin.vercel.app/api/dashboard/payments/${residentId}`
        );
        setPayments((prevPayments) => ({
          ...prevPayments,
          [residentId]: response.data,
        }));
      } catch (error) {
        console.error(`Error fetching payments for resident ${residentId}:`, error);
      }
    }
  };

  const filterPaymentsByMonth = (paymentList, month) => {
    if (!month) return paymentList;
    return paymentList.filter(
      (payment) => format(new Date(payment.date), 'MMMM') === month
    );
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Select Hostel</InputLabel>
          <Select
            value={selectedHostel}
            onChange={handleHostelChange}
            style={{ marginTop: '2rem', marginBottom: '1rem' }}
          >
            <MenuItem value="">All Hostels</MenuItem>
            {hostels.map((hostel) => (
              <MenuItem key={hostel.id} value={hostel.name}>
                {hostel.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Select Month</InputLabel>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            style={{ marginBottom: '1rem' }}
          >
            <MenuItem value="">All Months</MenuItem>
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h4" gutterBottom>
          New Resident List
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Resident Name</TableCell>
                <TableCell>Hostel</TableCell>
                <TableCell>Room Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredResident.map((resident) => (
                <React.Fragment key={resident._id}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleTogglePayments(resident._id)}
                      >
                        {openResidents[resident._id] ? 'up' : 'down' }
                      </IconButton>
                    </TableCell>
                    <TableCell>{resident.name}</TableCell>
                    <TableCell>{resident.hostel}</TableCell>
                    <TableCell>{resident.roomNumber}</TableCell>
                    <TableCell>{resident.email}</TableCell>
                    <TableCell>{resident.amount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={openResidents[resident._id]} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Typography variant="h6" gutterBottom component="div">
                            Payments
                          </Typography>
                          <Table size="small" aria-label="payments">
                            <TableHead>
                              <TableRow>
                                <TableCell>Month</TableCell>
                                <TableCell>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filterPaymentsByMonth(
                                payments[resident._id] || [],
                                selectedMonth
                              ).map((payment) => (
                                <TableRow key={payment._id}>
                                  <TableCell>{payment.month}</TableCell>
                                  <TableCell>
                                    {payment.status} {payment.cash && '(Cash Payment)'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default NewResidentList;



