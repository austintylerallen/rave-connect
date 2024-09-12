import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserLocation } from '../utils/location';
import Modal from '../UI/Modal';
import { FaStar } from 'react-icons/fa';

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
    includeElectronicGenreInd: true,
    includeOtherGenreInd: false,
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [artistImage, setArtistImage] = useState('');

  useEffect(() => {
    fetchUserLocationEvents();
    loadFavoritesFromLocalStorage();
  }, [filters]);

  const loadFavoritesFromLocalStorage = () => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  };

  const saveFavoritesToLocalStorage = (updatedFavorites) => {
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const fetchArtistImage = async (artistNames, spotifyAccessToken) => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/search`, {
        params: { q: artistNames, type: 'artist', limit: 1 },
        headers: { Authorization: `Bearer ${spotifyAccessToken}` },
      });
      return response.data.artists.items[0]?.images[0]?.url || '/raveplaceholder.jpg';
    } catch (err) {
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
              return { ...event, artistImage };
            }
            return event;
          }));

          setEvents(eventsWithArtists);
        } else {
          setError('Could not determine the state from your location.');
        }
      } else {
        setError('Failed to get location information.');
      }
    } catch (err) {
      setError('Failed to fetch events for your location.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleEventClick = async (event) => {
    setSelectedEvent(event);

    if (event.artistList && event.artistList.length > 0) {
      const artistNames = event.artistList.map(artist => artist.name).join(',');
      try {
        const spotifyTokenResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/spotify/token`);
        const spotifyAccessToken = spotifyTokenResponse.data.accessToken;
        const image = await fetchArtistImage(artistNames, spotifyAccessToken);
        setArtistImage(image);
      } catch (err) {
        setArtistImage('/raveplaceholder.jpg');
      }
    } else {
      setArtistImage('/raveplaceholder.jpg');
    }
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setArtistImage('');
  };

  const toggleFavorite = (eventId) => {
    let updatedFavorites;
    if (favorites.includes(eventId)) {
      updatedFavorites = favorites.filter(id => id !== eventId);
    } else {
      updatedFavorites = [...favorites, eventId];
    }
    setFavorites(updatedFavorites);
    saveFavoritesToLocalStorage(updatedFavorites);
  };

  const isFavorite = (eventId) => {
    return favorites.includes(eventId);
  };

  return (
    <div className="mt-8 p-6 bg-transparent rounded-lg"> {/* Removed the background color */}
      <h1 className="text-4xl font-bold text-purple-200 mb-8 text-center">Explore Events</h1>

      {/* Centered Filter Section */}
      <div className="mb-6 flex justify-center"> {/* Centered the filter section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-800 p-6 rounded-lg shadow-md">
          <input
            type="text"
            name="eventName"
            placeholder="Event Name"
            value={filters.eventName}
            onChange={handleFilterChange}
            className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            name="artistIds"
            placeholder="Artist"
            value={filters.artistIds}
            onChange={handleFilterChange}
            className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            name="venueIds"
            placeholder="Venue"
            value={filters.venueIds}
            onChange={handleFilterChange}
            className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="md:col-span-2 lg:col-span-1 flex space-x-4">
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {loading && <p className="text-center text-gray-400">Loading events...</p>}
      {error && <div className="text-red-400 text-center">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer group transition-transform transform hover:scale-105"
              onClick={() => handleEventClick(event)}
            >
              <img
                src={event.artistImage || '/raveplaceholder.jpg'}
                alt={event.name || 'Event'}
                className="w-full h-full object-cover group-hover:opacity-75 transition-opacity duration-300 ease-in-out"
                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out p-4">
                <h2 className="text-xl font-bold text-white uppercase">
                  {event.name || event.artistList?.map(artist => artist.name).join(', ') || 'Unnamed Event'}
                </h2>
                <p className="text-sm font-semibold text-gray-300 uppercase">
                  {event.venue?.name || 'Unknown Venue'}, {event.venue?.location || 'Unknown Location'}
                </p>
                <p className="text-gray-400">
                  {event.date ? new Date(event.date).toLocaleDateString() : 'Date Unknown'}
                </p>
                <button
                  className={`mt-2 px-2 py-1 rounded ${
                    isFavorite(event.id) ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(event.id);
                  }}
                >
                  <FaStar className={`inline-block mr-2 ${isFavorite(event.id) ? 'text-white' : 'text-yellow-500'}`} />
                  {isFavorite(event.id) ? 'Unfavorite' : 'Favorite'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No events available.</p>
        )}
      </div>

      {selectedEvent && (
        <Modal onClose={handleCloseModal}>
          <div className="flex">
            <div className="w-1/3">
              <img src={artistImage} alt={selectedEvent.name} className="w-full h-auto object-cover rounded-lg" />
            </div>
            <div className="w-2/3 pl-4">
              <h2 className="text-2xl font-bold mb-4">{selectedEvent.name}</h2>
              <p className="text-gray-400 mb-2">Date: {new Date(selectedEvent.date).toLocaleString()}</p>
              <p className="text-gray-400 mb-2">Venue: {selectedEvent.venue?.name || 'Unknown Venue'}</p>
              <p className="text-gray-400 mb-2">Location: {selectedEvent.venue?.location || 'Unknown Location'}</p>
              <p className="text-gray-400 mb-4">{selectedEvent.description || 'No description available.'}</p>
              <button
                className={`mt-4 py-2 px-4 rounded ${
                  isFavorite(selectedEvent.id) ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-400'
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
