// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { CssBaseline, MenuItem, Select, Typography } from '@mui/material';
// // import dayjs from 'dayjs';

// // const Payment = () => {
// //   const [payments, setPayments] = useState([]);
// //   const [filteredPayments, setFilteredPayments] = useState([]);
// //   const [month, setMonth] = useState(dayjs().format('YYYY-MM')); 
// //   const [hostels, setHostels] = useState([]);
// //   const [status,setStatus] = useState('');
// //   const [residents,setResidents] = useState([]);
  
// //   useEffect(() => {
// //     axios.get('https://beiyo-admin.vercel.app/api/hostels')
// //       .then(response => {
// //         setHostels(response.data);
// //       })
// //       .catch(error => {
// //         console.error('Error fetching hostels:', error);
// //       });
// //   }, []);

// //   useEffect(() => {
// //     axios.get('https://beiyo-admin.vercel.app/api/dashboard/payments')
// //       .then(response => {
// //         setPayments(response.data);
// //         filterPayments(response.data, month);
// //       })
// //       .catch(error => {
// //         console.error('Error fetching payments:', error);
// //       });
// //   }, []);

// //   useEffect(() => {
// //     filterPayments(payments, month);
// //   }, [month, payments]);

// //   const filterPayments = (payments, month) => {
// //     const filtered = payments.filter(payment => dayjs(payment.date).format('YYYY-MM') === month);
// //     setFilteredPayments(filtered);

// //   };

// //   const handleMonthChange = (event) => {
// //     setMonth(event.target.value);
// //   };
// //   const handleStatusChange = (event) => {
// //     setStatus(event.target.value);
// //   };
 
// //   return (
// //     <div>
// //       <CssBaseline/>
// //       <h1>Payments</h1> 
// //       <Typography variant="h6">Select Month:</Typography>
// //       <Select
// //         value={month}
// //         onChange={handleMonthChange}
// //         fullWidth
// //         sx={{ mb: 2 }}
// //       >
// //         {Array.from({ length: 12 }, (_, i) => {
// //           const monthValue = dayjs().month(i).format('YYYY-MM');
// //           return (
// //             <MenuItem key={monthValue} value={monthValue}>
// //               {dayjs().month(i).format('MMMM YYYY')}
// //             </MenuItem>
// //           );
// //         })}
        
// //       </Select>
// //       <Select
// //         value={status}
// //         onChange={handleStatusChange}
// //         fullWidth
// //         sx={{ mb: 2 }}
// //       >
// //          <MenuItem>
// //          successful
// //          </MenuItem> 
// //         <MenuItem>
// //         due
// //         </MenuItem>
        
// //       </Select>
// //       {/* <FormControl fullWidth variant="outlined">
// //             <InputLabel>Hostel</InputLabel>
// //             <Select
// //               name="hostel"
// //               value={filterOptions.hostel}
// //               onChange={handleFilterChange}
// //               label="Hostel"
// //             >
// //               <MenuItem value="all">All</MenuItem>
// //               {hostels.map((hostel) => (
// //                 <MenuItem key={hostel._id} value={hostel._id}>
// //                   {hostel.name}
// //                 </MenuItem>
// //               ))}
// //             </Select>
// //           </FormControl> */}
// //       <ol>
// //         {filteredPayments.map(payment => (
// //           <li key={payment.id}> {payment.userName} {payment.amount} {payment.status} {payment.cash&&(<>through cash</>)}</li>
// //         ))}
// //       </ol>
// //     </div>
// //   );
// // }

// // export default Payment;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, CssBaseline, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [status, setStatus] = useState('');
  const [selectedHostel, setSelectedHostel] = useState('');
  const [hostels, setHostels] = useState([]);
  const [residents, setResidents] = useState({});

  useEffect(() => {
    axios.get('https://beiyo-admin.vercel.app/api/hostels')
      .then(response => {
        setHostels(response.data);
      })
      .catch(error => {
        console.error('Error fetching hostels:', error);
      });
  }, []);

  const handleSearch = () => {
    const filtered = filteredPayments.filter(payment =>
      payment.userName.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    setFilteredPayments(filtered);
  };


  useEffect(() => {
    const fetchPaymentsAndResidents = async () => {
      try {
        // Fetch payments
        const paymentsResponse = await axios.get('https://beiyo-admin.vercel.app/api/dashboard/payments');
        const paymentsData = paymentsResponse.data;
        setPayments(paymentsData);

        // Fetch residents for each payment concurrently
        const residentPromises = paymentsData.map(async (payment) => {
          try {
            const residentResponse = await axios.get(`https://beiyo-admin.vercel.app/api/dashboard/payment/user/${payment._id}`);
            return { [payment._id]: residentResponse.data };
          } catch (error) {
            console.error('Error fetching user:', error);
            return null; // Handle error case if needed
          }
        });

        // Wait for all resident promises to resolve and update residents state
        const resolvedResidents = await Promise.all(residentPromises);

        const residentsObject = Object.assign({}, ...resolvedResidents.filter(Boolean));
        setResidents(residentsObject);
        // console.log('Residents data:', residentsObject);
      } catch (error) {
        console.error('Error fetching payments or residents:', error);
      }
    };

    fetchPaymentsAndResidents();
  }, []);

  useEffect(() => {
    const filterPayments = (payments, month, status, hostel) => {
      let filtered = payments.filter(payment => dayjs(payment.date).format('YYYY-MM') === month);

      if (status) {
        filtered = filtered.filter(payment => payment.status === status);
      }

      if (hostel) {
        filtered = filtered.filter(payment => {
          const resident = residents[payment._id];
          return resident && resident[0].hostel === hostel;
        });
        // console.log(filtered);
      }

      setFilteredPayments(filtered);
    };

    filterPayments(payments, month, status, selectedHostel);
  }, [month, status, selectedHostel, payments, residents]);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleHostelChange = (event) => {
    setSelectedHostel(event.target.value);
  };

  return (
    <div>
      <CssBaseline />
      <h1>Payments</h1>
      {/* <Typography variant="h6">Select Month:</Typography> */}
      <TextField
            fullWidth
            label="Search by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
          />
            <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ height: '100%' }}
          >
            Search
          </Button>
      <Select
        value={month}
        onChange={handleMonthChange}
        fullWidth
        sx={{ mb: 2 }}
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
      <FormControl fullWidth variant="outlined">
        <InputLabel>Status</InputLabel>
      <Select
        value={status}
        onChange={handleStatusChange}
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="successful">Successful</MenuItem>
        <MenuItem value="due">Due</MenuItem>
      </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined">
        <InputLabel>Hostel</InputLabel>
        <Select
          value={selectedHostel}
          onChange={handleHostelChange}
          label="Hostels"
          fullWidth
        >
          <MenuItem value="">All Hostels</MenuItem>
          {hostels.map(hostel => (
            <MenuItem key={hostel._id} value={hostel.name}>
              {hostel.name}
            </MenuItem>
          ))}
        </Select>
          </FormControl>

      <ol>
        {filteredPayments.map(payment => {
          const resident = residents[payment._id];
          return (
            <li key={payment._id}>
              {payment.userName} {payment.amount} {payment.status} {payment.cash && 'through cash'}
              {resident && resident[0].hostel} {resident && resident[0].roomNumber}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Payment;




