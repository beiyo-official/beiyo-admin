// src/components/UpdateBedsForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from '@mui/material';

const UpdateBedsForm = ({ room, onSubmit, onClose }) => {
  const [remainingBeds, setRemainingBeds] = useState(room ? room.remainingCapacity : '');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setRemainingBeds(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!remainingBeds) {
      setError('Please fill out the remaining beds.');
      return;
    }

    // const data = { remainingCapacity: remainingBeds };

    try {
     await axios.patch(`https://beiyo-admin.vercel.app/api/rooms/${room._id}/updateRemainingBeds`, {remainingBeds});
      onSubmit();
    } catch (error) {
      console.error('Error updating beds:', error);
      setError('Error updating beds. Please try again.');
    }
  };

  return (
    <>
      <DialogTitle>Update Beds</DialogTitle>
      <DialogContent>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remaining Beds"
                value={remainingBeds}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </>
  );
};

export default UpdateBedsForm;
