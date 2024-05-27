import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Grid,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const BedForm = ({ bedId, onSubmit  }) => {
  const [charge, setCharge] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [duration, setDuration] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [name, setName] = useState('');
  const [open,setOpen] = useState(true);

  useEffect(() => {
    if (bedId) {
      axios
        .get(`https://beiyo-admin.vercel.app/api/beds/${bedId}`)
        .then((response) => {
          const bed = response.data;
          setName(bed.name || '');
          setCharge(bed.charge || '');
          setAvailableFrom(bed.availableFrom ? bed.availableFrom.split('T')[0] : '');
          setPaymentStatus(bed.paymentStatus || '');
          setDuration(bed.duration || '');
          setDueDate(bed.dueDate ? bed.dueDate.split('T')[0] : '');
        })
        .catch((error) => {
          console.error('Error fetching bed details:', error);
        });
    }
  }, [bedId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      charge,
      availableFrom,
      paymentStatus,
      duration,
      dueDate,
      name,
    };
    try {
      await axios.patch(`https://beiyo-admin.vercel.app/api/beds/${bedId}`, data);
      onSubmit();
    } catch (error) {
      console.error('Error updating bed details:', error);
    }
  };


  return (
    <Dialog open={open} >
      <CssBaseline />
      <DialogTitle>Update Bed Details</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Living Person"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deposit"
                type="number"
                value={charge}
                onChange={(e) => setCharge(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Available From"
                type="date"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Payment Status"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  Select Status
                </MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={()=>{
              setOpen(false);
            }} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Update
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BedForm;
