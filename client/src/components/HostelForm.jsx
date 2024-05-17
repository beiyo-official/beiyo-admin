// src/components/HostelForm.js

import React, { useState } from 'react';
import axios from 'axios';

const HostelForm = ({ hostel, onSubmit }) => {
  const [name, setName] = useState(hostel ? hostel.name : '');
  const [location, setLocation] = useState(hostel ? hostel.location : '');
  const [locationLink, setlocationLink] = useState(hostel ? hostel.locationLink : '');
  const [price, setPrice] = useState(hostel ? hostel.price : '');
  const [image, setimage] = useState(hostel ? hostel.image : '');
  const [image2, setimage2] = useState(hostel ? hostel.image2 : '');
  const [image3, setimage3] = useState(hostel ? hostel.image3 : '');
  const [single, setsingle] = useState(hostel ? hostel.single : '');
  const [singlePrice, setsinglePrice] = useState(hostel ? hostel.singlePrice : '');
  const [ doubleprice, setdoubleprice] = useState(hostel ? hostel.doubleprice : '');
  const [tripleprice, settripleprice] = useState(hostel ? hostel.tripleprice : '');
  const [nearby1, setnearby1] = useState(hostel ? hostel.nearby1 : '');
  const [nearby2, setnearby2] = useState(hostel ? hostel.nearby2 : '');
  const [nearby3, setnearby3] = useState(hostel ? hostel.nearby3 : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      location,
      locationLink,
      price,
      image,
      image2,
      image3,
      single,
      singlePrice,
      doubleprice,
      tripleprice,
      nearby1,
      nearby2,
      nearby3,
    };
    if (hostel) {
      await axios.patch(`https://beiyo-admin.vercel.app/api/hostels/${hostel._id}`, data);
    } else {
      await axios.post('https://beiyo-admin.vercel.app/api/hostels', data);
    }
    onSubmit();
  };

  const handleDelete = async () => {
    await axios.delete(`https://beiyo-admin.vercel.app/api/hostels/${hostel._id}`);
    onSubmit();
  };

  return (
    <div>
      <h2>{hostel ? 'Update Hostel' : 'Add Hostel'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <label>
          Locationlink:
          <input type="text" value={locationLink} onChange={(e) => setlocationLink(e.target.value)} />
        </label>
        <label>
        price:
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label>
          image:
          <input type="text" value={image} onChange={(e) => setimage(e.target.value)} />
        </label>
        <label>
        image2:
          <input type="text" value={image2} onChange={(e) => setimage2(e.target.value)} />
        </label>
        <label>
          image3:
          <input type="text" value={image3} onChange={(e) => setimage3(e.target.value)} />
        </label>
        <label>
          single:
          <input type="text" value={single} onChange={(e) => setsingle(e.target.value)} />
        </label>
        <label>
          singlePrice:
          <input type="text" value={singlePrice} onChange={(e) => setsinglePrice(e.target.value)} />
        </label>
        <label>
          doubleprice:
          <input type="text" value={doubleprice} onChange={(e) => setdoubleprice(e.target.value)} />
        </label>
        <label>
          tripleprice:
          <input type="text" value={tripleprice} onChange={(e) => settripleprice(e.target.value)} />
        </label>
        <label>
          nearby1:
          <input type="text" value={nearby1} onChange={(e) => setnearby1(e.target.value)} />
        </label>
        <label>
          nearby2:
          <input type="text" value={nearby2} onChange={(e) => setnearby2(e.target.value)} />
        </label>
        <label>
          nearby3:
          <input type="text" value={nearby3} onChange={(e) => setnearby3(e.target.value)} />
        </label>
        <button type="submit">{hostel ? 'Update' : 'Add'}</button>
        {/* {hostel && <button onClick={handleDelete}>Delete</button>} */}
      </form>
    </div>
  );
};

export default HostelForm;
