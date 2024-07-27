import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CssBaseline } from '@mui/material';
import {format} from 'date-fns'
const NewResidentList = () => {
  const [residents, setResidents] = useState([]);
  const[filteredResident,setFilteredResident]=useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleHostelChange = (event) => {
    const selectedHostel = event.target.value;
    const filtered = residents.filter(resident => resident.hostel === selectedHostel);
    setFilteredResident(filtered);
  };
  

  useEffect(() => {
    axios.get('https://beiyo-admin.vercel.app/api/newResident')
      .then(response => {
        setResidents(response.data);
        setFilteredResident(response.data);
      })
      .catch(error => {
        console.error('Error fetching residents:', error);
      });
  }, []);
 
  return (
   
    <div>
      
         <CssBaseline/>
      <select onChange={handleHostelChange} style={{marginTop:'10rem'}} >
        <option value="">Select Hostel</option>
        {hostels.map(hostel => (
          <option key={hostel.id} value={hostel.name}>{hostel.name}</option>
        ))}
      </select>
      <h1>New Resident List</h1>
      <ul>
        {filteredResident.map(resident => (
          <li key={resident.id}>{resident.name} {resident.hostel} {resident.roomNumber} {resident.email} {resident.amount} {resident.contract} </li>
        ))}
      </ul>
    </div>
  );
}

export default NewResidentList;