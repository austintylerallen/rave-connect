import React, { useState } from 'react';
import axios from 'axios';

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/events', {
        title,
        description,
        date,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      console.log('Event created:', response.data);
      // Reset form or redirect to event page
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-darkTeal rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-4">Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-teal">Title</label>
          <input 
            type="text" 
            className="w-full p-2 rounded bg-white text-darkTeal" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-teal">Description</label>
          <textarea 
            className="w-full p-2 rounded bg-white text-darkTeal" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-teal">Date</label>
          <input 
            type="date" 
            className="w-full p-2 rounded bg-white text-darkTeal" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-teal">Location</label>
          <input 
            type="text" 
            className="w-full p-2 rounded bg-white text-darkTeal" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-teal">Latitude</label>
          <input 
            type="number" 
            className="w-full p-2 rounded bg-white text-darkTeal" 
            value={latitude} 
            onChange={(e) => setLatitude(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-teal">Longitude</label>
          <input 
            type="number" 
            className="w-full p-2 rounded bg-white text-darkTeal" 
            value={longitude} 
            onChange={(e) => setLongitude(e.target.value)} 
            required 
          />
        </div>
        <button 
          type="submit" 
          className="bg-purple text-white py-2 px-4 rounded hover:bg-darkPurple"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
