// src/components/RoomList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomForm from './RoomForm';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    availability: 'all',
    type: 'all',
    capacity: 'all',
    hostel: 'all',
  });
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/rooms')
      .then(response => {
        setRooms(response.data);
        setFilteredRooms(response.data);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });

    axios.get('http://localhost:5000/api/hostels')
      .then(response => {
        setHostels(response.data);
      })
      .catch(error => {
        console.error('Error fetching hostels:', error);
      });
  }, []);

  useEffect(() => {
    let filtered = rooms.filter(room => {
      let match = true;
      if (filterOptions.availability !== 'all') {
        if (filterOptions.availability === 'empty') {
          match = room.remainingCapacity > 0;
        } else {
          match = room.remainingCapacity === 0;
        }
      }
      if (match && filterOptions.type !== 'all') {
        match = room.type === filterOptions.type;
      }
      if (match && filterOptions.capacity !== 'all') {
        match = room.capacity === parseInt(filterOptions.capacity);
      }
      if (match && filterOptions.hostel !== 'all') {
        match = room.hostelId === filterOptions.hostel;
      }
      return match;
    });
    setFilteredRooms(filtered);
  }, [rooms, filterOptions]);

  const handleEdit = (room) => {
    setEditingRoom(room);
  };

  const handleFormSubmit = () => {
    setEditingRoom(null);
    axios.get('http://localhost:5000/api/rooms')
      .then(response => {
        setRooms(response.data);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions({
      ...filterOptions,
      [name]: value,
    });
  };
  const handleRemainingBedsChange = async (roomId, remainingBeds) => {
    try {
      await axios.patch(`http://localhost:5000/api/rooms/${roomId}/updateRemainingBeds`, { remainingBeds });
      // Update local state after successful update
      setRooms(prevRooms => prevRooms.map(room => room._id === roomId ? { ...room, remainingCapacity: remainingBeds } : room));
    } catch (error) {
      console.error('Error updating remaining beds:', error);
    }
  }
 

  return (
    <div>
      <h2>Rooms</h2>
      <div>
        <label>
          Availability:
          <select name="availability" value={filterOptions.availability} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="empty">Empty</option>
            <option value="occupied">Occupied</option>
          </select>
        </label>
        <label>
          Type:
          <select name="type" value={filterOptions.type} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
          </select>
        </label>
        <label>
          Capacity:
          <select name="capacity" value={filterOptions.capacity} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            {/* Add more capacity options as needed */}
          </select>
        </label>
        <label>
          Hostel:
          <select name="hostel" value={filterOptions.hostel} onChange={handleFilterChange}>
            <option value="all">All</option>
            {hostels.map(hostel => (
              <option key={hostel._id} value={hostel._id}>{hostel.name}</option>
            ))}
          </select>
        </label>
      </div>
      <ul>
        {filteredRooms.map(room => (
          <li key={room._id} style={{ backgroundColor: room.remainingCapacity === 0 ? 'red' : room.remainingCapacity === room.capacity ? 'green' : 'yellow' }}>
             {hostels.find(hostel => hostel._id === room.hostelId).name} - {room.roomNumber} - Capacity: {room.capacity} - Remaining Beds: {room.remainingCapacity}
             <select value={room.remainingCapacity} onChange={(e) => handleRemainingBedsChange(room._id, parseInt(e.target.value))}>
              {[...Array(room.capacity + 1).keys()].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            {/* <button onClick={() => handleDelete(room._id)}>Delete</button> */}
          </li>
        ))}
      </ul>
      {editingRoom && <RoomForm room={editingRoom} hostels={hostels} onSubmit={handleFormSubmit} />}
      {!editingRoom && <RoomForm hostels={hostels} onSubmit={handleFormSubmit} />}
    </div>
  );
};

export default RoomList;
