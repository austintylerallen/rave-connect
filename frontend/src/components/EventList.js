import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserLocation } from '../utils/location';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [filters, setFilters] = useState({
    eventName: '',
    artistIds: '',
    venueIds: '',
    startDate: '',
    endDate: '',
    festivalInd: false,
    livestreamInd: false,
    includeElectronicGenreInd: true,
    includeOtherGenreInd: false,
  });

  useEffect(() => {
    fetchUserLocationEvents();
  }, [filters]);

  const fetchArtistImage = async (artistNames, spotifyAccessToken) => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/search`, {
        params: {
          q: artistNames,
          type: 'artist',
          limit: 1,
        },
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      });
      return response.data.artists.items[0]?.images[0]?.url || '/raveplaceholder.jpg';
    } catch (err) {
      if (err.response && err.response.status === 429) {
        const retryAfter = err.response.headers['retry-after'] || 1;
        console.warn(`Rate limited, retrying after ${retryAfter} seconds`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return fetchArtistImage(artistNames, spotifyAccessToken);
      }
      console.error('Error fetching artist image:', err);
      return '/raveplaceholder.jpg';
    }
  };

  const fetchUserLocationEvents = async () => {
    setLoading(true);
    setError('');

    try {
      const position = await getUserLocation();
      const { latitude, longitude } = position;

      const geoResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
      );

      if (geoResponse.data.status === 'OK' && geoResponse.data.results.length > 0) {
        const addressComponents = geoResponse.data.results[0].address_components;
        const stateComponent = addressComponents.find(component =>
          component.types.includes('administrative_area_level_1')
        );
        const state = stateComponent?.long_name;

        if (state) {
          const spotifyTokenResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/spotify/token`);
          const spotifyAccessToken = spotifyTokenResponse.data.accessToken;

          const response = await axios.get('https://edmtrain.com/api/events', {
            params: {
              latitude,
              longitude,
              state,
              client: process.env.REACT_APP_EDM_TRAIN_API_KEY,
              ...filters,
            },
          });

          const eventsData = response.data.data || [];

          const eventsWithArtists = await Promise.all(eventsData.map(async (event) => {
            if (event.artistList && event.artistList.length > 0) {
              const artistNames = event.artistList.map(artist => artist.name).join(',');
              const artistImage = await fetchArtistImage(artistNames, spotifyAccessToken);
              return {
                ...event,
                artistImage,
              };
            }
            return event;
          }));

          setEvents(eventsWithArtists);
        } else {
          setError('Could not determine the state from your location.');
        }
      } else {
        console.error('Geocoding API response:', geoResponse.data);
        setError('Failed to get location information.');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events for your location.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Events</h1>

      <div className="mb-4">
  <input
    type="text"
    name="eventName"
    placeholder="Event Name"
    value={filters.eventName}
    onChange={handleFilterChange}
    className="mr-2 p-2 border text-gray-800"
  />
  <input
    type="text"
    name="artistIds"
    placeholder="Artist IDs"
    value={filters.artistIds}
    onChange={handleFilterChange}
    className="mr-2 p-2 border text-gray-800"
  />
  <input
    type="text"
    name="venueIds"
    placeholder="Venue IDs"
    value={filters.venueIds}
    onChange={handleFilterChange}
    className="mr-2 p-2 border text-gray-800"
  />
  <input
    type="date"
    name="startDate"
    placeholder="Start Date"
    value={filters.startDate}
    onChange={handleFilterChange}
    className="mr-2 p-2 border text-gray-800"
  />
  <input
    type="date"
    name="endDate"
    placeholder="End Date"
    value={filters.endDate}
    onChange={handleFilterChange}
    className="mr-2 p-2 border text-gray-800"
  />
  <label className="mr-2 text-gray-800">
    <input
      type="checkbox"
      name="festivalInd"
      checked={filters.festivalInd}
      onChange={() => setFilters({ ...filters, festivalInd: !filters.festivalInd })}
      className="mr-1"
    />
    Festivals Only
  </label>
  <label className="text-gray-800">
    <input
      type="checkbox"
      name="livestreamInd"
      checked={filters.livestreamInd}
      onChange={() => setFilters({ ...filters, livestreamInd: !filters.livestreamInd })}
      className="mr-1"
    />
    Live Streams Only
  </label>
</div>


      {loading && <p className="text-center text-gray-500">Loading events...</p>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={event.artistImage || '/raveplaceholder.jpg'}
                alt={event.eventName || 'Event'}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {event.eventName || event.artistList?.map(artist => artist.name).join(', ') || 'Unnamed Event'}
                </h2>
                <p className="text-gray-600">
                  {event.venue?.name || 'Unknown Venue'}, {event.venue?.location || 'Unknown Location'}
                </p>
                <p className="text-gray-500">
                  {event.date ? new Date(event.date).toLocaleDateString() : 'Date Unknown'}
                </p>
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 text-blue-500 hover:underline"
                >
                  More Info
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No events available.</p>
        )}
      </div>
    </div>
  );
};

export default EventList;
