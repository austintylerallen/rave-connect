import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getUserLocation } from '../utils/location';

const EventSelectionModal = ({ isOpen, onClose, onSelectEvent }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]); // For search filtering
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageCache, setImageCache] = useState({});
  const [page, setPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchEvents(1); // Fetch the first page of events when modal opens
    }
  }, [isOpen]);

  // Search filter logic
  useEffect(() => {
    const filtered = events.filter(event => {
      const eventName = event.eventName || event.artistList?.map(artist => artist.name).join(', ');
      return eventName?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const fetchArtistImage = async (artistNames, spotifyAccessToken, retries = 3) => {
    if (imageCache[artistNames]) {
      return imageCache[artistNames];
    }

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

      const imageUrl = response.data.artists.items[0]?.images[0]?.url || '/raveplaceholder.jpg';
      setImageCache((prevCache) => ({ ...prevCache, [artistNames]: imageUrl }));
      return imageUrl;
    } catch (err) {
      if (err.response && err.response.status === 429 && retries > 0) {
        const retryAfter = parseInt(err.response.headers['retry-after'], 10) || 1;
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        return fetchArtistImage(artistNames, spotifyAccessToken, retries - 1);
      } else {
        return '/raveplaceholder.jpg';
      }
    }
  };

  const fetchEvents = async (page) => {
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
              page,
              per_page: 10,
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
            return {
              ...event,
              artistImage: '/raveplaceholder.jpg',
            };
          }));

          setEvents((prevEvents) => [...prevEvents, ...eventsWithArtists]);
          setTotalEvents(response.data.total);
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

  const handleSelect = (event) => {
    onSelectEvent({
      id: event.id,
      name: event.eventName || event.artistList?.map(artist => artist.name).join(', ') || 'Unnamed Event',
      image: event.artistImage,
      venue: event.venue?.name || 'Unknown Venue',
      date: event.date ? new Date(event.date).toLocaleDateString() : 'Date Unknown',
    });
    onClose();
  };

  const handleScroll = () => {
    if (
      modalRef.current.scrollTop + modalRef.current.clientHeight >=
      modalRef.current.scrollHeight
    ) {
      if (events.length < totalEvents) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          fetchEvents(nextPage);
          return nextPage;
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`bg-darkTeal text-white rounded-lg overflow-hidden shadow-lg max-w-lg w-full transition-transform duration-500 ease-in-out transform ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div ref={modalRef} className="p-4 h-80 overflow-y-auto space-y-4" onScroll={handleScroll}>
          <h2 className="text-2xl font-bold text-white mb-4">Select Event</h2>

          {/* Search bar input */}
          <input
            type="text"
            placeholder="Search events or artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-400 rounded-lg text-gray-900"
          />

          {loading && page === 1 ? (
            <p className="text-center text-gray-500">Loading events...</p>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center space-x-4 p-2 border rounded cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(event)}
              >
                <img
                  src={event.artistImage}
                  alt={event.eventName || 'Event'}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">
                    {event.eventName || event.artistList?.map(artist => artist.name).join(', ') || 'Unnamed Event'}
                  </h3>
                  <p className="text-gray-300">{event.venue?.name || 'Unknown Venue'}</p>
                  <p className="text-gray-400">{event.date ? new Date(event.date).toLocaleDateString() : 'Date Unknown'}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-gray-700">
          <button
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventSelectionModal;
