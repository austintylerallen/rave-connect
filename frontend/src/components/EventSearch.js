import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventSearch = ({ onResults }) => {
  const [keyword, setKeyword] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [genre, setGenre] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      }, (error) => {
        console.error('Error obtaining location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get('/api/events/search', {
        params: { keyword, date, location, genre, latitude, longitude }
      });
      onResults(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl">
      <h3 className="text-white text-3xl font-extrabold mb-6 text-center">Find Your Next Event</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Keyword"
          className="p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          type="date"
          className="p-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Genre"
          className="p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
      </div>
      <button
        onClick={handleSearch}
        className="mt-8 w-full bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out font-bold shadow-md"
      >
        Search Events
      </button>
    </div>
  );
};

export default EventSearch;
