import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BedForm from './BedForm';

const BedList = () => {
    const {roomId} = useParams();
  const [beds, setBeds] = useState([]);
  const [room, setroom] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBedId,setSelectedBedId] = useState(null);
  useEffect(() => {
    const fetchBeds = async () => {
      try {
        const response = await axios.get(`https://beiyo-admin.vercel.app/api/beds/rooms/${roomId}/beds`);
        // const responseOfRoom = await axios.get(`https://beiyo-admin.vercel.app/api/rooms/${roomId}`);
        // setroom(responseOfRoom);
        setBeds(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching beds:', error);
      }
    };
    fetchBeds();
  }, [roomId]);
const getColorisEmpty=(isEmpty)=>{
  if(isEmpty){
    return 'red';
  }else{
    return 'grey';
  }
};
 
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
  };
  const handleFormSubmit = () => {
    setSelectedBedId(null);
    axios.get(`https://beiyo-admin.vercel.app/api/rooms/${roomId}/beds`)
      .then(response => {
        setBeds(response.data);
      })
      .catch(error => {
        console.error('Error fetching beds:', error);
      });
  };
  return (
    <div>
      <h2>Beds for Room </h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {beds.map(bed => (
            <li key={bed._id} style={{backgroundColor: getColorisEmpty(bed.isEmpty)}} >
              <p>Bed Number: {bed.bedNumber}</p>
              <p>Charge: {bed.charge}</p>
              <p style={{ backgroundColor: getColor(bed.paymentStatus) }} >Status: {bed.paymentStatus}</p>
              <p>Due Date: {new Date(bed.dueDate).toLocaleDateString()}</p>
              <p>Available From: {new Date(bed.availableFrom).toLocaleDateString()}</p>
              <button onClick={() => handleEditClick(bed._id)}>Edit</button>
            </li>
          ))}
        </ul>
      )}
       {selectedBedId && <BedForm bedId={selectedBedId} onSubmit={handleFormSubmit} />}
    </div>
  );
};

export default BedList;
