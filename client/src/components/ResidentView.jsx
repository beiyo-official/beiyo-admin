import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';

const ResidentDetails = ({ residentId, open, onClose }) => {
  const [resident, setResident] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openRoomSwapDialog, setOpenRoomSwapDialog] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [oldRoomId, setOldRoomId] = useState('');
  const [newRoomId, setNewRoomId] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    if (open && residentId) {
      setLoading(true);
      setResident(null);
      setPayments([]);
      
      // Fetch resident details
      axios.get(`https://beiyo-admin.in/api/newResident/${residentId}`)
        .then(response => {
          setResident(response.data);
          // Fetch resident payments
          if (response.data.payments && response.data.payments.length > 0) {
            axios.get(`https://beiyo-admin.in/api/dashboard/paymentsArray?ids=${response.data.payments.join(',')}`)
              .then(paymentResponse => {
                setPayments(paymentResponse.data);
                console.log(payments);
                setLoading(false);
              })
              .catch(error => {
                console.error('Error fetching payments:', error);
                setLoading(false);
              });
          } else {
            setPayments([]);
            setLoading(false);
          }
        })
        .catch(error => {
          console.error('Error fetching resident details:', error);
          setLoading(false);
        });
    }
  }, [residentId, open]);


  // Function to delete payment
const handleDeletePayment = (paymentId) => {
  setLoading(true);
  axios.delete(`https://beiyo-admin.in/api/dashboard/deletePayment/${paymentId}`)
    .then(() => {
      // Remove the deleted payment from the state
      setPayments(payments.filter(payment => payment._id !== paymentId));
      setLoading(false);
    })
    .catch(error => {
      console.error('Error deleting payment:', error);
      setLoading(false);
    });
};

// Function to mark payment as cash
const handleCashPayment = (paymentId) => {
  setLoading(true);
  axios.put(`https://beiyo-admin.in/api/dashboard/cashPayment/${paymentId}`)
    .then(response => {
      // Update the payment in the state
      setPayments(payments.map(payment => 
        payment._id === paymentId ? { ...payment, cash: true, status: 'successful' } : payment
      ));
      setLoading(false);
    })
    .catch(error => {
      console.error('Error updating payment to cash:', error);
      setLoading(false);
    });
};


  const handleRoomSwapOpen = () => {
    // Fetch available rooms when the dialog is opened
    axios.get('https://beiyo-admin.in/api/rooms')
      .then(response => setRooms(response.data))
      .catch(error => console.error('Error fetching rooms:', error));
    setOpenRoomSwapDialog(true);
  };

  const handleRoomSwap = () => {
    if (oldRoomId && newRoomId) {
      axios.put(`https://beiyo-admin.in/api/rooms/roomSwap/${residentId}`, {
        oldRoomId,
        newRoomId
      })
      .then(response => {
        console.log('Room swapped successfully:', response.data);
        setOpenRoomSwapDialog(false);
        onClose();  // Close the main dialog and refresh resident details
      })
      .catch(error => console.error('Error swapping rooms:', error));
    } else {
      console.error('Please select both old and new rooms.');
    }
  };

  const handleDeleteResident = () => {
    if (residentId) {
      axios.delete(`https://beiyo-admin.in/api/newResident/deleteResident/${residentId}`)
        .then(() => {
          setDeleteSuccess(true);
          onClose();  // Close the dialog after successful deletion
        })
        .catch(error => {
          setDeleteError('Failed to delete resident. Please try again.');
          console.error('Error deleting resident:', error);
        });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Resident Details</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <CircularProgress />
            </Box>
          ) : resident ? (
            <Box>
              <Typography variant="h6">{resident.name}</Typography>
              <Typography color="text.secondary">
                id: {resident._id}
              </Typography>
              <Typography color="text.secondary">
                Email: {resident.email}
              </Typography>
              <Typography color="text.secondary">
                Mobile Number: {resident.mobileNumber}
              </Typography>
              <Typography color="text.secondary">
                Address: {resident.address}
              </Typography>
              <Typography color="text.secondary">
                Parents' Name: {resident.parentsName}
              </Typography>
              <Typography color="text.secondary">
                Parents' Mobile No: {resident.parentsMobileNo}
              </Typography>
              <Typography color="text.secondary">
                Hostel: {resident.hostel}
              </Typography>
              <Typography color="text.secondary">
                Room Number: {resident.roomNumber}
              </Typography>
              <Typography color="text.secondary">
                Date Joined: {new Date(resident.dateJoined).toLocaleDateString()}
              </Typography>
              <Typography color="text.secondary">
                Contract End Date: {new Date(resident.contractEndDate).toLocaleDateString()}
              </Typography>
              <Typography color="text.secondary">
                Rent: {resident.rent}
              </Typography>
              <Typography color="text.secondary">
                Deposit: {resident.deposit}
              </Typography>
              <Typography color="text.secondary">
                Maintenance Charge: {resident.maintainaceCharge}
              </Typography>
              <Typography color="text.secondary">
                Form Fee: {resident.formFee}
              </Typography>
              <Typography color="text.secondary">
                Due Amount: {resident.dueAmount}
              </Typography>

              {/* Display resident images */}
              <Box sx={{ mt: 2 }}>
                {resident.imageUrl && <img src={resident.imageUrl} alt={`${resident.name} - Profile`} style={{ width: '100%', height: 'auto' }} />}
                {resident.aadhaarCardUrl && <img src={resident.aadhaarCardUrl} alt={`${resident.name} - Aadhaar Card`} style={{ width: '100%', height: 'auto', marginTop: '10px' }} />}
              </Box>

              {/* Display payments */}
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Payments:
              </Typography>
              {payments.length > 0 ? (
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Amount</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Rent</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Additional Charge</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Cash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(payment => (
                        <tr key={payment._id}>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(payment.date).toLocaleDateString()}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{payment.amount}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{payment.rent}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{payment.additionalCharge}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{payment.status}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{payment.type}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{payment.cash ? 'Yes' : 'No'}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleDeletePayment(payment._id)}
          disabled={loading}
        >
          Delete
        </Button>
      </td>
      <td style={{ border: '1px solid #ddd', padding: '8px' }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleCashPayment(payment._id)}
          disabled={payment.status === 'successful' && payment.cash}
        >
          Mark as Cash
        </Button>
      </td>
                         

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              ) : (
                <Typography color="text.secondary">No payments available.</Typography>
              )}

              {/* Swap Room Button */}
              <Button variant="contained" color="primary" onClick={handleRoomSwapOpen} sx={{ mt: 3 }}>
                Swap Room
              </Button>
            </Box>
          ) : (
            <Typography color="text.secondary">No resident data available.</Typography>
          )}

          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}

          {deleteSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Resident deleted successfully.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">Close</Button>
          <Button
            color="error"
            onClick={handleDeleteResident}
            disabled={loading}
          >
            Delete Resident
          </Button>
        </DialogActions>
      </Dialog>

      {/* Room Swap Dialog */}
      <Dialog open={openRoomSwapDialog} onClose={() => setOpenRoomSwapDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Swap Room</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Old Room</InputLabel>
              <Select
                value={oldRoomId}
                onChange={(e) => setOldRoomId(e.target.value)}
                label="Old Room"
              >
                {rooms.map(room => (
                  <MenuItem key={room._id} value={room._id}>
                    {room.roomNumber} - {room.hostel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>New Room</InputLabel>
              <Select
                value={newRoomId}
                onChange={(e) => setNewRoomId(e.target.value)}
                label="New Room"
              >
                {rooms.map(room => (
                  <MenuItem key={room._id} value={room._id}>
                    {room.roomNumber} - {room.hostel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoomSwapDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleRoomSwap} color="secondary">Swap Room</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResidentDetails;
