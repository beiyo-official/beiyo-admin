import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CssBaseline } from '@mui/material';

const NewResidentList = () => {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    axios.get('https://beiyo-admin.vercel.app/api/newResident')
      .then(response => {
        setResidents(response.data);
      })
      .catch(error => {
        console.error('Error fetching residents:', error);
      });
  }, []);

  return (
   
    <div>
         <CssBaseline/>
      <h1>New Resident List</h1>
      <ul>
        {residents.map(resident => (
          <li key={resident.id}>{resident.name} {resident.hostel} {resident.roomNumber}</li>
        ))}
      </ul>
    </div>
  );
}

export default NewResidentList;