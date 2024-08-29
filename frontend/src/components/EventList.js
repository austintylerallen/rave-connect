import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserLocation } from '../utils/location';
import Modal from '../UI/Modal'; // Import the Modal component
import { FaStar } from 'react-icons/fa'; // Import Font Awesome star icon

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store selected event
  const [favorites, setFavorites] = useState([]); // State to store favorite events
  const [artistImage, setArtistImage] = useState(''); // State to store artist image for modal

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
          const edmTrainResponse = await axios.get('https://edmtrain.com/api/events', {
            params: {
              latitude,
              longitude,
              state,
              client: process.env.REACT_APP_EDM_TRAIN_API_KEY,
              ...filters,
            },
          });

          const eventsData = edmTrainResponse.data.data || [];

          const spotifyTokenResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/spotify/token`);
          const spotifyAccessToken = spotifyTokenResponse.data.accessToken;

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

  const handleEventClick = async (event) => {
    setSelectedEvent(event); // Set the selected event directly from the list data

    if (event.artistList && event.artistList.length > 0) {
      const artistNames = event.artistList.map(artist => artist.name).join(',');
      try {
        const spotifyTokenResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/spotify/token`);
        const spotifyAccessToken = spotifyTokenResponse.data.accessToken;
        const image = await fetchArtistImage(artistNames, spotifyAccessToken);
        setArtistImage(image); // Set artist image for modal
      } catch (err) {
        console.error('Error fetching artist image for modal:', err);
        setArtistImage('/raveplaceholder.jpg');
      }
    } else {
      setArtistImage('/raveplaceholder.jpg');
    }
  };

  const handleCloseModal = () => {
    setSelectedEvent(null); // Clear the selected event when modal is closed
    setArtistImage(''); // Clear artist image when modal is closed
  };

  const toggleFavorite = (eventId) => {
    if (favorites.includes(eventId)) {
      setFavorites(favorites.filter(id => id !== eventId));
    } else {
      setFavorites([...favorites, eventId]);
    }
  };

  const isFavorite = (eventId) => {
    return favorites.includes(eventId);
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
            <div
              key={event.id}
              className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group"
              onClick={() => handleEventClick(event)} // Open modal on click
            >
              <img
                src={event.artistImage || '/raveplaceholder.jpg'}
                alt={event.name || 'Event'}
                className="w-full h-full object-cover group-hover:opacity-75 transition-opacity duration-300 ease-in-out"
                style={{ height: '100%', width: '100%', objectFit: 'cover' }} // Adjusted image size
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out p-4">
                <h2 className="text-xl font-bold text-white uppercase">
                  {event.name || event.artistList?.map(artist => artist.name).join(', ') || 'Unnamed Event'}
                </h2>
                <p className="text-sm font-semibold text-gray-200 uppercase">
                  {event.venue?.name || 'Unknown Venue'}, {event.venue?.location || 'Unknown Location'}
                </p>
                <p className="text-gray-300">
                  {event.date ? new Date(event.date).toLocaleDateString() : 'Date Unknown'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No events available.</p>
        )}
      </div>

      {/* Modal for event details */}
      {selectedEvent && (
        <Modal onClose={handleCloseModal}>
          <div className="flex">
            <div className="w-1/3">
              <img src={artistImage} alt={selectedEvent.name} className="w-full h-auto object-cover rounded-lg" />
            </div>
            <div className="w-2/3 pl-4">
              <h2 className="text-2xl font-bold mb-4">{selectedEvent.name}</h2>
              <p className="text-gray-600 mb-2">Date: {new Date(selectedEvent.date).toLocaleString()}</p>
              <p className="text-gray-600 mb-2">Venue: {selectedEvent.venue?.name || 'Unknown Venue'}</p>
              <p className="text-gray-600 mb-2">Location: {selectedEvent.venue?.location || 'Unknown Location'}</p>
              <p className="text-gray-600 mb-4">{selectedEvent.description || 'No description available.'}</p>
              <button
                className={`mt-4 py-2 px-4 rounded ${
                  isFavorite(selectedEvent.id) ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
                onClick={() => toggleFavorite(selectedEvent.id)}
              >
                <FaStar className={`inline-block mr-2 ${isFavorite(selectedEvent.id) ? 'text-white' : 'text-yellow-500'}`} />
                {isFavorite(selectedEvent.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EventList;
