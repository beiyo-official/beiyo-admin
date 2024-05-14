// src/components/InventoryList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    axios.get('https://beiyo-admin.vercel.app/api/inventory')
      .then(response => {
        setInventory(response.data);
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      });
  }, []);

  return (
    <div>
      <h2>Inventory</h2>
      <ul>
        {inventory.map(item => (
          <li key={item._id}>{item.itemName} - Quantity: {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryList;
