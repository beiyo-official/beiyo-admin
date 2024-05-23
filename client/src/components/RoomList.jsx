// src/components/RoomList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomForm from './RoomForm';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortByPrice,setSortByPrice] = useState('all');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    availability: 'all',
    type: 'all',
    capacity: 'all',
    hostel: 'all',
  });

  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    let filtered = rooms.filter(room => {
      let match = true;
      // Your existing filtering logic...
  
      // Check if the room price falls within the selected price range
      if (priceFilter !== 'all') {
        switch (priceFilter) {
          case 'less-than-3000':
            match = room.price < 3000;
            break;
          case 'less-than-4000':
            match = room.price < 4000;
            break;
          case 'less-than-5000':
            match = room.price < 5000;
            break;
          case 'greater-than-3000':
            match = room.price > 3000;
            break;
          case 'greater-than-4000':
            match = room.price > 4000;
            break;
          case 'greater-than-5000':
            match = room.price > 5000;
            break;
          default:
            // No price filter applied
            break;
        }
      }
  
      return match;
    });
  
    // Sort the filtered rooms based on the selected price filter
    switch (sortByPrice) {
      case 'low-to-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'high-to-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        // No price sorting needed
        break;
    }
  
    setFilteredRooms(filtered);
  }, [rooms, filterOptions, priceFilter,sortByPrice]);
  


  useEffect(() => {
    axios.get('https://beiyo-admin.vercel.app/api/rooms')
      .then(response => {
        setRooms(response.data);
        setFilteredRooms(response.data);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });

    axios.get('https://beiyo-admin.vercel.app/api/hostels')
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
    axios.get('https://beiyo-admin.vercel.app/api/rooms')
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
      await axios.patch(`https://beiyo-admin.vercel.app/api/rooms/${roomId}/updateRemainingBeds`, { remainingBeds });
      // Update  state after successful update
      setRooms(prevRooms => prevRooms.map(room => room._id === roomId ? { ...room, remainingCapacity: remainingBeds } : room));
      axios.get(`https://beiyo-admin.vercel.app/api/hostels/calculateTotalRemainingBeds`);
    } catch (error) {
      console.error('Error updating remaining beds:', error);
    }
  }
  const handleCleaning = async (roomId, status, lastCleanedAt) => {
    try {
      await axios.patch(`https://beiyo-admin.vercel.app/api/rooms/${roomId}`, { status, lastCleanedAt });
      setRooms(prevRooms => prevRooms.map(room => room._id === roomId ? { ...room, status, lastCleanedAt } : room));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }
  const handleSearch = () => {
    
    const filtered = rooms.filter(room =>
      room.hostel.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    setFilteredRooms(filtered);
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <h2>Rooms</h2>
      <div>
      <div>
        <input
          type="text"
          placeholder="Search by hostel name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
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
            <option value="Flat">Flat</option>
          </select>
        </label>
        <label>
          Capacity:
          <select name="capacity" value={filterOptions.capacity} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            {/* Add more capacity options as needed */}
          </select>
        </label>
        <label>
     Price:
  <select name="price" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
    <option value="all">All</option>
    <option value="less-than-3000">Less than Rs3000</option>
    <option value="less-than-4000">Less than Rs4000</option>
    <option value="less-than-5000">Less than Rs5000</option>
    <option value="greater-than-3000">Greater than Rs3000</option>
    <option value="greater-than-4000">Greater than Rs4000</option>
    <option value="greater-than-5000">Greater than Rs5000</option>
  </select>
</label>
<label>
      Sort by Price:
      <select name="sortByPrice" value={sortByPrice} onChange={(e) => setSortByPrice(e.target.value)}>
        <option value="none">None</option>
        <option value="low-to-high">Low to High</option>
        <option value="high-to-low">High to Low</option>
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
          <li key={room._id} style={{ backgroundColor: room.remainingCapacity === 0 ? 'green' : room.remainingCapacity === room.capacity ? 'red' : 'grey' }}>
             {hostels.find(hostel => hostel._id === room.hostelId).name} - <a href={`/rooms/${room._id}/beds`}> {room.roomNumber}</a> - Capacity: {room.capacity} - Remaining Beds: {room.remainingCapacity} - Price: {room.price} - {room.status}
             <select value={room.remainingCapacity} onChange={(e) => handleRemainingBedsChange(room._id, parseInt(e.target.value))}>
              {[...Array(room.capacity + 1).keys()].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            {/* <button onClick={() => handleDelete(room._id)}>Delete</button> */}
            <select value={room.status} onChange={(e) => handleCleaning(room._id, e.target.value, new Date().toISOString())}>
              <option value="clean">Clean</option>
              <option value="dirty">Dirty</option>
            </select>
            Last Cleaned At: <span>{formatDate(room.lastCleanedAt)}</span>
          </li>
        
        ))}
      </ul>
      {editingRoom && <RoomForm room={editingRoom} hostels={hostels} onSubmit={handleFormSubmit} />}
      {!editingRoom && <RoomForm hostels={hostels} onSubmit={handleFormSubmit} />}
    </div>
  );
};

export default RoomList;
