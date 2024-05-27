// // src/components/RoomForm.js

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const RoomForm = ({ room, hostels, onSubmit }) => {
//   const [roomNumber, setRoomNumber] = useState(room ? room.roomNumber : '');
//   const [type, setType] = useState(room ? room.type : '');
//   const [capacity, setCapacity] = useState(room ? room.capacity : '');
//   const [remainingBeds, setRemainingBeds] = useState(room ? room.remainingCapacity : '');
//   const [hostelId, setHostelId] = useState(room ? room.hostelId : '');
//   const [price, setPrice] = useState(room ? room.price : '');
//   const [error, setError] = useState('');
//   const [existingRoomNumbers, setExistingRoomNumbers] = useState([]);

//   useEffect(() => {
//     axios.get('https://beiyo-admin.vercel.app/api/rooms')
//       .then(response => {
//         const roomNumbers = response.data.map(room => room.roomNumber);
//         setExistingRoomNumbers(roomNumbers);
//       })
//       .catch(error => {
//         console.error('Error fetching rooms:', error);
//       });
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!roomNumber || !type || !capacity || !remainingBeds || !hostelId || !price) {
//       setError('Please fill out all fields.');
//       return;
//     }

  
//       // setError('Room number already exists. Please choose a different room number.');
//       // return;
//       if (roomNumber.hostelId === hostelId) {
//         if (existingRoomNumbers.includes(roomNumber)) {
//         setError('Room number already exists in the same hostel. Please choose a different room number.');
//         return;
//       }
//     }

//     const data = {
//       roomNumber,
//       type,
//       capacity,
//       remainingCapacity: remainingBeds,
//       hostelId,
//       price,
//       hostel: hostels.find(hostel => hostel._id === hostelId).name
//     };
//     if (room) {
//       await axios.patch(`https://beiyo-admin.vercel.app/api/rooms/${room._id}`, data);
//     } else {
//       await axios.post('https://beiyo-admin.vercel.app/api/rooms', data);
//     }
//     onSubmit();
//   };

//   return (
//     <div>
//       <h2>{room ? 'Update Room' : 'Add Room'}</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <label>
//           Room Number:
//           <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
//         </label>
//         <label>
//           Price:
//           <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
//         </label>
//         <label>
//           Type:
//           <select value={type} onChange={(e) => setType(e.target.value)}>
//             <option value="">Select Type</option>
//             <option value="single">Single</option>
//             <option value="double">Double</option>
//             <option value="triple">Triple</option>
//             <option value="triple">Flat</option>
//           </select>
//         </label>
//         <label>
//           Capacity:
//           <select value={capacity} onChange={(e) => setCapacity(e.target.value)}>
//             <option value="">Select Capacity</option>
//             <option value="1">1</option>
//             <option value="2">2</option>
//             <option value="3">3</option>
//             <option value="3">4</option>
//             {/* Add more capacity options as needed */}
//           </select>
//         </label>
//         <label>
//           Remaining Beds:
//           <select value={remainingBeds} onChange={(e) => setRemainingBeds(e.target.value)}>
//             <option value="">Select Remaining Beds</option>
//             <option value="0">0</option>
//             <option value="1">1</option>
//             <option value="2">2</option>
//             <option value="3">3</option>
//             {/* Add more options as needed */}
//           </select>
//         </label>
//         <label>
//           Hostel:
//           <select value={hostelId} onChange={(e) => setHostelId(e.target.value)}>
//             <option value="">Select Hostel</option>
//             {hostels.map(hostel => (
//               <option key={hostel._id} value={hostel._id}>{hostel.name}</option>
//             ))}
//           </select>
//         </label>
//         <button type="submit">{room ? 'Update' : 'Add'}</button>
//       </form>
//     </div>
//   );
// };

// export default RoomForm;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

const RoomForm = ({ room, hostels=[], onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    roomNumber: room ? room.roomNumber : '',
    type: room ? room.type : '',
    capacity: room ? room.capacity : '',
    remainingBeds: room ? room.remainingCapacity : '',
    hostelId: room ? room.hostelId : '',
    price: room ? room.price : '',
  });

  const [error, setError] = useState('');
  const [existingRoomNumbers, setExistingRoomNumbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://beiyo-admin.vercel.app/api/rooms')
      .then(response => {
        const roomNumbers = response.data.map(room => room.roomNumber);
        setExistingRoomNumbers(roomNumbers);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { roomNumber, type, capacity, remainingBeds, hostelId, price } = formData;

    if (!roomNumber || !type || !capacity || !remainingBeds || !hostelId || !price) {
      setError('Please fill out all fields.');
      return;
    }

    if (existingRoomNumbers.includes(roomNumber) && (!room || room.roomNumber !== roomNumber)) {
      setError('Room number already exists. Please choose a different room number.');
      return;
    }

    const data = {
      roomNumber,
      type,
      capacity,
      remainingCapacity: remainingBeds,
      hostelId,
      price,
      hostel: hostels.find(hostel => hostel._id === hostelId).name
    };

    try {
      if (room) {
        await axios.patch(`https://beiyo-admin.vercel.app/api/rooms/${room._id}`, data);
      } else {
        await axios.post('https://beiyo-admin.vercel.app/api/rooms', data);
      }
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Error saving room:', error);
      setError('Error saving room. Please try again.');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <DialogTitle>{room ? 'Update Room' : 'Add Room'}</DialogTitle>
      <DialogContent>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Room Number"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type"
                >
                  <MenuItem value="">Select Type</MenuItem>
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="double">Double</MenuItem>
                  <MenuItem value="triple">Triple</MenuItem>
                  <MenuItem value="flat">Flat</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Capacity</InputLabel>
                <Select
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  label="Capacity"
                >
                  <MenuItem value="">Select Capacity</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Remaining Beds</InputLabel>
                <Select
                  name="remainingBeds"
                  value={formData.remainingBeds}
                  onChange={handleChange}
                  label="Remaining Beds"
                >
                  <MenuItem value="">Select Remaining Beds</MenuItem>
                  <MenuItem value="0">0</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Hostel</InputLabel>
                <Select
                  name="hostelId"
                  value={formData.hostelId}
                  onChange={handleChange}
                  label="Hostel"
                >
                  <MenuItem value="">Select Hostel</MenuItem>     
                  {hostels.map(hostel => (
                    <MenuItem key={hostel._id} value={hostel._id}>{hostel.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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

export default RoomForm;


