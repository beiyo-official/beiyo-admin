



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
  useMediaQuery
} from '@mui/material';
// import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";
import { format } from 'date-fns';

const NewResidentList = () => {
  const [residents, setResidents] = useState([]);
  const [filteredResident, setFilteredResident] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [payments, setPayments] = useState({});
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [openResidents, setOpenResidents] = useState({});

  const isMobile = useMediaQuery('(max-width:600px)');

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

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
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

  const filterPaymentsByMonthAndStatus = (paymentList, month, status) => {
    return paymentList.filter(payment => {
      const matchesMonth = !month || format(new Date(payment.date), 'MMMM') === month;
      const matchesStatus = !status || payment.status === status;
      return matchesMonth && matchesStatus;
    });
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

  const statuses = ['successful', 'due'];

  return (
    <div>
      <CssBaseline />
      <Box sx={{ p: { xs: 1, sm: 3 } }}>
        <FormControl fullWidth>
          <InputLabel>Select Hostel</InputLabel>
          <Select
            value={selectedHostel}
            onChange={handleHostelChange}
            sx={{ mt: 2, mb: 2 }}
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
            sx={{ mb: 2 }}
          >
            <MenuItem value="">All Months</MenuItem>
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Select Payment Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h4" gutterBottom>
          New Resident List
        </Typography>

        <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
          <Table size={isMobile ? "small" : "medium"} sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Resident Name</TableCell>
                <TableCell>Hostel</TableCell>
                {!isMobile && <TableCell>Room Number</TableCell>}
                <TableCell>Email</TableCell>
                {!isMobile && <TableCell>Amount</TableCell>}
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
                        {openResidents[resident._id] ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{resident.name}</TableCell>
                    <TableCell>{resident.hostel}</TableCell>
                    {!isMobile && <TableCell>{resident.roomNumber}</TableCell>}
                    <TableCell>{resident.email}</TableCell>
                    {!isMobile && <TableCell>{resident.amount}</TableCell>}
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
                              {filterPaymentsByMonthAndStatus(
                                payments[resident._id] || [],
                                selectedMonth,
                                selectedStatus
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
