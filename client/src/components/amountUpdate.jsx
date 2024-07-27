import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Select, MenuItem, InputLabel, FormControl, CssBaseline, Grid } from '@mui/material';
import dayjs from 'dayjs';

const AmountForm = () => {
  
  // const [hostel,setHostel]= useState(null);
  const [formData, setFormData] = useState({
    
    email: '',
    contract:dayjs().format('YYYY-MM-DD'),
    amount:''
  });
 





  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


    
  

  const handleSubmit = async (e) => {
    e.preventDefault();
        await axios.post('http://localhost:5000/api/newResident/amount', formData);
        alert(successfull);
      setFormData({
        email: '',
        contract:dayjs().format('YYYY-MM-DD'),
        amount:'',
      })
  };

  return (
   <div className='paymentform'>
     <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#', minHeight: '80vh', border:2,borderRadius:2}} >
      <CssBaseline />
      <Typography variant="h4" gutterBottom>
        Amount contract Form
      </Typography>
      <form onSubmit={handleSubmit} noValidate style={{width:'100%'}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </Grid>
          <TextField
          label="Contract end"
          name="contract"
          type="date"
          value={formData.contract}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Submit & Pay
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
   </div>
  );
};

export default AmountForm;