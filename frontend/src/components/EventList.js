import React, { useState } from 'react';
import { getEvents } from '../services/edmTrainService';

const EventList = () => {
  const [events, setEvents] = useState([]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        try {
          const fetchedEvents = await getEvents(location);
          setEvents(fetchedEvents);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      }, (error) => {
        console.error('Error obtaining location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <button onClick={handleGetLocation} className="bg-purple text-white py-2 px-4 rounded">
        Find Events Near Me
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-darkTeal p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-purple">{event.name}</h3>
            <p className="text-teal">{new Date(event.date).toLocaleDateString()}</p>
            <p className="mt-2 text-white">{event.venue.name}</p>
            <p className="mt-2 text-white">{event.location}</p>
            <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-purple mt-4 block hover:underline">
              More Info
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
