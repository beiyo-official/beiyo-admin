import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BedForm from './BedForm';
import Header from './Header';
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  Button,
  Modal,
  Fade,
  Backdrop,
  CssBaseline,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2, 4, 3),
  boxShadow: theme.shadows[5],
}));

const BedList = () => {
  const { roomId } = useParams();
  const [beds, setBeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBedId, setSelectedBedId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchBeds();
  }, [roomId]);

  const fetchBeds = async () => {
    try {
      const response = await axios.get(`https://beiyo-admin.vercel.app/api/beds/rooms/${roomId}/beds`);
      setBeds(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching beds:', error);
    }
  };

  // const getColorisEmpty = (isEmpty) => {
  //   return isEmpty ? 'red' : 'grey';
  // };

  const getColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'grey';
      case 'overdue':
        return 'red';
      default:
        return 'grey';
    }
  };

  const handleEditClick = (bedId) => {
    setSelectedBedId(bedId);
    setOpen(true);
  };

  const handleFormSubmit = () => {
    setSelectedBedId(null);
    setOpen(false);
    fetchBeds(); // Ensure we refetch the beds after form submission to get the updated data
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <CssBaseline />
      <Header />
      <Typography mt={4} variant="h4" gutterBottom>
        Beds for Room
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={6} >
          {beds.map((bed) => (
            <Grid item key={bed._id} xs={12} sm={12} md={12} >
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  p: 1,
                  backgroundColor: '#fff',
                  display:'flex',
                  flexDirection:'column'
                }}
              >
                <Typography variant="h6">Bed Number: {bed.bedNumber}</Typography>
                <Typography>Living Person: {bed.name}</Typography>
                <Typography>Deposit: {bed.charge}</Typography>
                <Typography sx={{ color: getColor(bed.paymentStatus) }}>
                  Status: {bed.paymentStatus}
                </Typography>
                <Typography>Due Date: {new Date(bed.dueDate).toLocaleDateString()}</Typography>
                <Typography>Available From: {new Date(bed.availableFrom).toLocaleDateString()}</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleEditClick(bed._id)}
                  sx={{ mt: 1 }}
                >
                  Edit
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <StyledPaper>
            <BedForm bedId={selectedBedId} onSubmit={handleFormSubmit} />
          </StyledPaper>
        </Fade>
      </Modal>
    </Box>
  );
};

export default BedList;
