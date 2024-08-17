// import React, { useEffect, useState } from 'react';
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   CircularProgress,
//   CssBaseline,
// } from '@mui/material';
// import { useFormik } from 'formik';
// import axios from 'axios';
// import Select from 'react-select';

// const ManagerForm = () => {
//   const [loading, setLoading] = useState(false);
//   const [hostels, setHostels] = useState([]);
//   const [selectedHostels, setSelectedHostels] = useState([]);

//   useEffect(() => {
//     axios.get('https://beiyo-admin.vercel.app/api/hostels')
//       .then(response => {
//         setHostels(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching hostels:', error);
//       });
//   }, []);

//   const formik = useFormik({
//     initialValues: {
//       name: '',
//       email: '',
//       mobileNumber: '',
//       password: '',
//       aadhaarCard: null,
//       photo: null,
//     },
//     onSubmit: async (values) => {
//       setLoading(true);
//       const formData = new FormData();
//       formData.append('name', values.name);
//       formData.append('email', values.email);
//       formData.append('mobileNumber', values.mobileNumber);
//       formData.append('password', values.password);
//       formData.append('hostelIds', selectedHostels.join(',')); // Send selected hostel IDs as a comma-separated string
//       formData.append('aadhaarCard', values.aadhaarCard);
//       formData.append('photo', values.photo);

//       try {
//         const response = await axios.post('/api/manager', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         console.log('Manager created:', response.data);
//       } catch (error) {
//         console.error('Error creating manager:', error);
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   const toggleHostelSelection = (hostelId) => {
//     setSelectedHostels((prevSelectedHostels) => {
//       const isSelected = prevSelectedHostels.includes(hostelId);
//       return isSelected
//         ? prevSelectedHostels.filter((id) => id !== hostelId)
//         : [...prevSelectedHostels, hostelId];
//     });
//   };

//   const HostelSelection = ({ hostels, selectedHostels, setSelectedHostels }) => {
//     const options = hostels.map((hostel) => ({
//       value: hostel.id,
//       label: hostel.name,
//     }));

//     const handleChange = (selectedOptions) => {
//       setSelectedHostels(selectedOptions.map((option) => option.value));
//     };

//     return (
//       <Select
//         isMulti
//         name="hostels"
//         options={options}
//         value={options.filter((option) => selectedHostels.includes(option.value))}
//         onChange={handleChange}
//       />
//     );
//   };

//   return (
//     <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 2, boxShadow: 3, borderRadius: 2 }}>
//       <CssBaseline />
//       <Typography variant="h5" gutterBottom>
//         Add New Manager
//       </Typography>
//       <form onSubmit={formik.handleSubmit}>
//         <TextField
//           fullWidth
//           margin="normal"
//           id="name"
//           name="name"
//           label="Name"
//           value={formik.values.name}
//           onChange={formik.handleChange}
//           required
//         />
//         <TextField
//           fullWidth
//           margin="normal"
//           id="email"
//           name="email"
//           label="Email"
//           type="email"
//           value={formik.values.email}
//           onChange={formik.handleChange}
//           required
//         />
//         <TextField
//           fullWidth
//           margin="normal"
//           id="mobileNumber"
//           name="mobileNumber"
//           label="Mobile Number"
//           value={formik.values.mobileNumber}
//           onChange={formik.handleChange}
//           required
//         />
//         <TextField
//           fullWidth
//           margin="normal"
//           id="password"
//           name="password"
//           label="Password"
//           type="password"
//           value={formik.values.password}
//           onChange={formik.handleChange}
//           required
//         />

//         <Typography variant="h6" gutterBottom>
//           Select Hostels Managed
//         </Typography>
//         <HostelSelection
//           hostels={hostels}
//           selectedHostels={selectedHostels}
//           setSelectedHostels={setSelectedHostels}
//         />

//         <Button
//           variant="contained"
//           component="label"
//           fullWidth
//           sx={{ mt: 2, mb: 1 }}
//         >
//           Upload Aadhaar Card
//           <input
//             type="file"
//             hidden
//             accept="image/*"
//             onChange={(event) => formik.setFieldValue('aadhaarCard', event.currentTarget.files[0])}
//             required
//           />
//         </Button>
//         <Button
//           variant="contained"
//           component="label"
//           fullWidth
//           sx={{ mb: 2 }}
//         >
//           Upload Photo
//           <input
//             type="file"
//             hidden
//             accept="image/*"
//             onChange={(event) => formik.setFieldValue('photo', event.currentTarget.files[0])}
//             required
//           />
//         </Button>
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} /> : 'Submit'}
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default ManagerForm;
