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
    <div className="p-4 bg-darkTeal rounded-lg">
      <h3 className="text-white text-xl mb-4">Search Events</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Keyword"
          className="p-2 rounded bg-white text-darkTeal"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          type="date"
          className="p-2 rounded bg-white text-darkTeal"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="p-2 rounded bg-white text-darkTeal"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Genre"
          className="p-2 rounded bg-white text-darkTeal"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
      </div>
      <button
        onClick={handleSearch}
        className="mt-4 bg-purple text-white py-2 px-4 rounded hover:bg-darkPurple"
      >
        Search
      </button>
    </div>
  );
};

export default EventSearch;
