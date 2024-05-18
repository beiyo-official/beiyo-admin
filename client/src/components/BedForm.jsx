import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BedForm = ({ bedId, onSubmit }) => {
  // const [isEmpty, setIsEmpty] = useState(false);
  const [charge, setCharge] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [duration, setDuration] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (bedId) {
      axios.get(`https://beiyo-admin.vercel.app/api/beds/${bedId}`)
        .then(response => {
          const bed = response.data;
          setCharge(bed.charge || ''); // Handle potential undefined values
          setAvailableFrom(bed.availableFrom || ''); // Handle potential undefined values
          setPaymentStatus(bed.paymentStatus || ''); // Handle potential undefined values
          setDuration(bed.duration || ''); // Handle potential undefined values
          setDueDate(bed.dueDate || ''); // Handle potential undefined values
        })
        .catch(error => {
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
      dueDate
    };
    try {
      await axios.patch(`https://beiyo-admin.vercel.app/api/beds/${bedId}`, data);
      onSubmit();
    } catch (error) {
      console.error('Error updating bed details:', error);
    }
  };

  return (
    <div>
      <h2>Update Bed Details</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Charge:
          <input type="number" value={charge} onChange={(e) => setCharge(e.target.value)} />
        </label>
        <label>
          Available From:
          <input type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} />
        </label>
        <label>
          Payment Status:
          <select name="" id="" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
            <option value='pending' >Pending</option>
            <option value='paid' >Paid</option>
            <option value='overdue' >Overdue</option>
          </select>
        </label>
        <label>
          Duration:
          <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </label>
        <label>
          Due Date:
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default BedForm;
