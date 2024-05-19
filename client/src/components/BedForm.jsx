import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BedForm = ({ bedId, onSubmit }) => {
  const [charge, setCharge] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(''); // Default to empty string to avoid uncontrolled issues
  const [duration, setDuration] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (bedId) {
      axios.get(`https://beiyo-admin.vercel.app/api/beds/${bedId}`)
        .then(response => {
          const bed = response.data;
          // Set state with fetched bed details, handling potential undefined values
          setCharge(bed.charge || '');
          setAvailableFrom(bed.availableFrom ? bed.availableFrom.split('T')[0] : ''); // Format date if available
          setPaymentStatus(bed.paymentStatus || ''); // Default to empty string
          setDuration(bed.duration || '');
          setDueDate(bed.dueDate ? bed.dueDate.split('T')[0] : ''); // Format date if available
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
      onSubmit(); // Trigger parent component to update bed list
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
          <input
            type="number"
            value={charge}
            onChange={(e) => setCharge(e.target.value)}
          />
        </label>
        <label>
          Available From:
          <input
            type="date"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
          />
        </label>
        <label>
          Payment Status:
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            required
          >
            <option value='' disabled>Select Status</option>
            <option value='pending'>Pending</option>
            <option value='paid'>Paid</option>
            <option value='overdue'>Overdue</option>
          </select>
        </label>
        <label>
          Duration:
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </label>
        <label>
          Due Date:
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default BedForm;
