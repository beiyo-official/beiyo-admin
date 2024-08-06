import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CssBaseline, MenuItem, Select, Typography } from '@mui/material';
import dayjs from 'dayjs';

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [month, setMonth] = useState(dayjs().format('YYYY-MM')); 

  useEffect(() => {
    axios.get('https://beiyo-admin.vercel.app/api/dashboard/payments')
      .then(response => {
        setPayments(response.data);
        filterPayments(response.data, month);
      })
      .catch(error => {
        console.error('Error fetching payments:', error);
      });
  }, []);

  useEffect(() => {
    filterPayments(payments, month);
  }, [month, payments]);

  const filterPayments = (payments, month) => {
    const filtered = payments.filter(payment => dayjs(payment.date).format('YYYY-MM') === month);
    setFilteredPayments(filtered);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };
 
  return (
    <div>
      <CssBaseline/>
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
      <ol>
        {filteredPayments.map(payment => (
          <li key={payment.id}> {payment.userName} {payment.amount} {payment.status} {payment.cash&&(<>through cash</>)}</li>
        ))}
      </ol>
    </div>
  );
}

export default Payment;
