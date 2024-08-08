// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { CssBaseline, MenuItem, Select, Typography } from '@mui/material';
// import dayjs from 'dayjs';

// const Payment = () => {
//   const [payments, setPayments] = useState([]);
//   const [filteredPayments, setFilteredPayments] = useState([]);
//   const [month, setMonth] = useState(dayjs().format('YYYY-MM')); 
//   const [hostels, setHostels] = useState([]);
//   const [status,setStatus] = useState('');
//   const [residents,setResidents] = useState([]);
  
//   useEffect(() => {
//     axios.get('https://beiyo-admin.vercel.app/api/hostels')
//       .then(response => {
//         setHostels(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching hostels:', error);
//       });
//   }, []);

//   useEffect(() => {
//     axios.get('https://beiyo-admin.vercel.app/api/dashboard/payments')
//       .then(response => {
//         setPayments(response.data);
//         filterPayments(response.data, month);
//       })
//       .catch(error => {
//         console.error('Error fetching payments:', error);
//       });
//   }, []);

//   useEffect(() => {
//     filterPayments(payments, month);
//   }, [month, payments]);

//   const filterPayments = (payments, month) => {
//     const filtered = payments.filter(payment => dayjs(payment.date).format('YYYY-MM') === month);
//     setFilteredPayments(filtered);

//   };

//   const handleMonthChange = (event) => {
//     setMonth(event.target.value);
//   };
//   const handleStatusChange = (event) => {
//     setStatus(event.target.value);
//   };
 
//   return (
//     <div>
//       <CssBaseline/>
//       <h1>Payments</h1> 
//       <Typography variant="h6">Select Month:</Typography>
//       <Select
//         value={month}
//         onChange={handleMonthChange}
//         fullWidth
//         sx={{ mb: 2 }}
//       >
//         {Array.from({ length: 12 }, (_, i) => {
//           const monthValue = dayjs().month(i).format('YYYY-MM');
//           return (
//             <MenuItem key={monthValue} value={monthValue}>
//               {dayjs().month(i).format('MMMM YYYY')}
//             </MenuItem>
//           );
//         })}
        
//       </Select>
//       <Select
//         value={status}
//         onChange={handleStatusChange}
//         fullWidth
//         sx={{ mb: 2 }}
//       >
//          <MenuItem>
//          successful
//          </MenuItem> 
//         <MenuItem>
//         due
//         </MenuItem>
        
//       </Select>
//       {/* <FormControl fullWidth variant="outlined">
//             <InputLabel>Hostel</InputLabel>
//             <Select
//               name="hostel"
//               value={filterOptions.hostel}
//               onChange={handleFilterChange}
//               label="Hostel"
//             >
//               <MenuItem value="all">All</MenuItem>
//               {hostels.map((hostel) => (
//                 <MenuItem key={hostel._id} value={hostel._id}>
//                   {hostel.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl> */}
//       <ol>
//         {filteredPayments.map(payment => (
//           <li key={payment.id}> {payment.userName} {payment.amount} {payment.status} {payment.cash&&(<>through cash</>)}</li>
//         ))}
//       </ol>
//     </div>
//   );
// }

// export default Payment;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CssBaseline, MenuItem, Select, Typography } from '@mui/material';
import dayjs from 'dayjs';

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [status, setStatus] = useState('');
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    axios.get('https://beiyo-admin.vercel.app/api/hostels')
      .then(response => {
        setHostels(response.data);
      })
      .catch(error => {
        console.error('Error fetching hostels:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('https://beiyo-admin.vercel.app/api/dashboard/payments')
      .then(response => {
        setPayments(response.data);
        filterPayments(response.data, month, status);
      })
      .catch(error => {
        console.error('Error fetching payments:', error);
      });
  }, []);

  useEffect(() => {
    filterPayments(payments, month, status);
  }, [month, status, payments]);

  const filterPayments = (payments, month, status) => {
    let filtered = payments.filter(payment => dayjs(payment.date).format('YYYY-MM') === month);

    if (status) {
      filtered = filtered.filter(payment => payment.status === status);
    }

    setFilteredPayments(filtered);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <div>
      <CssBaseline />
      <h1>Payments</h1>
      <Typography variant="h6">Select Month:</Typography>
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

      <Typography variant="h6">Select Status:</Typography>
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

      <ol>
        {filteredPayments.map(payment => (
          <li key={payment.id}>
            {payment.userName} {payment.amount} {payment.status} {payment.cash && 'through cash'}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Payment;
