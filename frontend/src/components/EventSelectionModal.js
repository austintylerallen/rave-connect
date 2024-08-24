// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { getUserLocation } from '../utils/location';

// // const EventSelectionModal = ({ isOpen, onClose, onSelectEvent }) => {
// //   const [events, setEvents] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [imageCache, setImageCache] = useState({});

// //   useEffect(() => {
// //     if (isOpen) {
// //       fetchEvents();
// //     }
// //   }, [isOpen]);

// //   const fetchArtistImage = async (artistNames, spotifyAccessToken) => {
// //     if (imageCache[artistNames]) {
// //       return imageCache[artistNames];
// //     }

// //     try {
// //       await new Promise((resolve) => setTimeout(resolve, 200)); // Add a delay between requests
// //       const response = await axios.get(`https://api.spotify.com/v1/search`, {
// //         params: {
// //           q: artistNames,
// //           type: 'artist',
// //           limit: 1,
// //         },
// //         headers: {
// //           Authorization: `Bearer ${spotifyAccessToken}`,
// //         },
// //       });

// //       const imageUrl = response.data.artists.items[0]?.images[0]?.url || '/raveplaceholder.jpg';
// //       setImageCache((prevCache) => ({ ...prevCache, [artistNames]: imageUrl }));
// //       return imageUrl;
// //     } catch (err) {
// //       if (err.response && err.response.status === 429) {
// //         console.warn('Rate limited, using fallback image');
// //       } else {
// //         console.error('Error fetching artist image:', err);
// //       }
// //       return '/raveplaceholder.jpg'; // Fallback image
// //     }
// //   };

// //   const fetchEvents = async () => {
// //     setLoading(true);
// //     setError('');

// //     try {
// //       const position = await getUserLocation();
// //       const { latitude, longitude } = position;

// //       const geoResponse = await axios.get(
// //         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
// //       );

// //       if (geoResponse.data.status === 'OK' && geoResponse.data.results.length > 0) {
// //         const addressComponents = geoResponse.data.results[0].address_components;
// //         const stateComponent = addressComponents.find(component =>
// //           component.types.includes('administrative_area_level_1')
// //         );
// //         const state = stateComponent?.long_name;

// //         if (state) {
// //           const spotifyTokenResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/spotify/token`);
// //           const spotifyAccessToken = spotifyTokenResponse.data.accessToken;

// //           const response = await axios.get('https://edmtrain.com/api/events', {
// //             params: {
// //               latitude,
// //               longitude,
// //               state,
// //               client: process.env.REACT_APP_EDM_TRAIN_API_KEY,
// //             },
// //           });

// //           const eventsData = response.data.data || [];

// //           const eventsWithArtists = await Promise.all(eventsData.map(async (event) => {
// //             if (event.artistList && event.artistList.length > 0) {
// //               const artistNames = event.artistList.map(artist => artist.name).join(',');
// //               const artistImage = await fetchArtistImage(artistNames, spotifyAccessToken);
// //               return {
// //                 ...event,
// //                 artistImage,
// //               };
// //             }
// //             return {
// //               ...event,
// //               artistImage: '/raveplaceholder.jpg', // Default image if no artists are available
// //             };
// //           }));

// //           setEvents(eventsWithArtists);
// //         } else {
// //           setError('Could not determine the state from your location.');
// //         }
// //       } else {
// //         console.error('Geocoding API response:', geoResponse.data);
// //         setError('Failed to get location information.');
// //       }
// //     } catch (err) {
// //       console.error('Error fetching events:', err);
// //       setError('Failed to fetch events for your location.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSelect = (event) => {
// //     onSelectEvent({
// //       id: event.id,
// //       name: event.eventName || event.artistList?.map(artist => artist.name).join(', ') || 'Unnamed Event',
// //       image: event.artistImage,
// //       venue: event.venue?.name || 'Unknown Venue',
// //       date: event.date ? new Date(event.date).toLocaleDateString() : 'Date Unknown',
// //     });
// //     onClose();
// //   };

// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
// //       <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-lg w-full">
// //         <div className="p-4">
// //           <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Event</h2>
// //           {loading ? (
// //             <p className="text-center text-gray-500">Loading events...</p>
// //           ) : error ? (
// //             <div className="text-red-500 text-center">{error}</div>
// //           ) : (
// //             <div className="h-80 overflow-y-auto space-y-4">
// //               {events.map((event) => (
// //                 <div
// //                   key={event.id}
// //                   className="flex items-center space-x-4 p-2 border rounded cursor-pointer hover:bg-gray-100"
// //                   onClick={() => handleSelect(event)}
// //                 >
// //                   <img
// //                     src={event.artistImage}
// //                     alt={event.eventName || 'Event'}
// //                     className="w-12 h-12 rounded"
// //                   />
// //                   <div>
// //                     <h3 className="text-lg font-semibold text-gray-900">
// //                       {event.eventName || event.artistList?.map(artist => artist.name).join(', ') || 'Unnamed Event'}
// //                     </h3>
// //                     <p className="text-gray-600">{event.venue?.name || 'Unknown Venue'}</p>
// //                     <p className="text-gray-500">{event.date ? new Date(event.date).toLocaleDateString() : 'Date Unknown'}</p>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //         <div className="p-4 border-t">
// //           <button
// //             className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
// //             onClick={onClose}
// //           >
// //             Cancel
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EventSelectionModal;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { getUserLocation } from '../utils/location';

// const EventSelectionModal = ({ isOpen, onClose, onSelectEvent }) => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [imageCache, setImageCache] = useState({});

//   useEffect(() => {
//     if (isOpen) {
//       fetchEvents();
//     }
//   }, [isOpen]);

//   const fetchArtistImage = async (artistNames, spotifyAccessToken) => {
//     if (imageCache[artistNames]) {
//       return imageCache[artistNames];
//     }

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 200)); // Add a delay between requests
//       const response = await axios.get(`https://api.spotify.com/v1/search`, {
//         params: {
//           q: artistNames,
//           type: 'artist',
//           limit: 1,
//         },
//         headers: {
//           Authorization: `Bearer ${spotifyAccessToken}`,
//         },
//       });

//       const imageUrl = response.data.artists.items[0]?.images[0]?.url || '/raveplaceholder.jpg';
//       setImageCache((prevCache) => ({ ...prevCache, [artistNames]: imageUrl }));
//       return imageUrl;
//     } catch (err) {
//       if (err.response && err.response.status === 429) {
//         console.warn('Rate limited, using fallback image');
//       } else {
//         console.error('Error fetching artist image:', err);
//       }
//       return '/raveplaceholder.jpg'; // Fallback image
//     }
//   };

//   const fetchEvents = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const position = await getUserLocation();
//       const { latitude, longitude } = position;

//       const geoResponse = await axios.get(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
//       );

//       if (geoResponse.data.status === 'OK' && geoResponse.data.results.length > 0) {
//         const addressComponents = geoResponse.data.results[0].address_components;
//         const stateComponent = addressComponents.find(component =>
//           component.types.includes('administrative_area_level_1')
//         );
//         const state = stateComponent?.long_name;

//         if (state) {
//           const spotifyTokenResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/spotify/token`);
//           const spotifyAccessToken = spotifyTokenResponse.data.accessToken;

//           const response = await axios.get('https://edmtrain.com/api/events', {
//             params: {
//               latitude,
//               longitude,
//               state,
//               client: process.env.REACT_APP_EDM_TRAIN_API_KEY,
//             },
//           });

//           const eventsData = response.data.data || [];

//           const eventsWithArtists = await Promise.all(eventsData.map(async (event) => {
//             if (event.artistList && event.artistList.length > 0) {
//               const artistNames = event.artistList.map(artist => artist.name).join(',');
//               const artistImage = await fetchArtistImage(artistNames, spotifyAccessToken);
//               return {
//                 ...event,
//                 artistImage,
//               };
//             }
//             return {
//               ...event,
//               artistImage: '/raveplaceholder.jpg', // Default image if no artists are available
//             };
//           }));

//           setEvents(eventsWithArtists);
//         } else {
//           setError('Could not determine the state from your location.');
//         }
//       } else {
//         console.error('Geocoding API response:', geoResponse.data);
//         setError('Failed to get location information.');
//       }
//     } catch (err) {
//       console.error('Error fetching events:', err);
//       setError('Failed to fetch events for your location.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelect = (event) => {
//     onSelectEvent({
//       id: event.id,
//       name: event.eventName || event.artistList?.map(artist => artist.name).join(', ') || 'Unnamed Event',
//       image: event.artistImage,
//       venue: event.venue?.name || 'Unknown Venue',
//       date: event.date ? new Date(event.date).toLocaleDateString() : 'Date Unknown',
//     });
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-lg w-full">
//         <div className="p-4">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Event</h2>
//           {loading ? (
//             <p className="text-center text-gray-500">Loading events...</p>
//           ) : error ? (
//             <div className="text-red-500 text-center">{error}</div>
//           ) : (
//             <div className="h-80 overflow-y-auto space-y-4">
//               {events.map((event) => (
//                 <div
//                   key={event.id}
//                   className="flex items-center space-x-4 p-2 border rounded cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSelect(event)}
//                 >
//                   <img
//                     src={event.artistImage}
//                     alt={event.eventName || 'Event'}
//                     className="w-12 h-12 rounded"
//                   />
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       {event.eventName || event.artistList?.map(artist => artist.name).join(', ') || 'Unnamed Event'}
//                     </h3>
//                     <p className="text-gray-600">{event.venue?.name || 'Unknown Venue'}</p>
//                     <p className="text-gray-500">{event.date ? new Date(event.date).toLocaleDateString() : 'Date Unknown'}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <div className="p-4 border-t">
//           <button
//             className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventSelectionModal;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserLocation } from '../utils/location';

const EventSelectionModal = ({ isOpen, onClose, onSelectEvent }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageCache, setImageCache] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen]);

  const fetchArtistImage = async (artistNames, spotifyAccessToken, retries = 3) => {
    if (imageCache[artistNames]) {
      return imageCache[artistNames];
    }
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 200)); // Initial delay
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
        console.warn(`Rate limited, retrying after ${retryAfter} seconds`);
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000)); // Wait before retrying
        return fetchArtistImage(artistNames, spotifyAccessToken, retries - 1);
      } else {
        console.error('Error fetching artist image:', err);
        return '/raveplaceholder.jpg'; // Fallback image
      }
    }
  };
  

  const fetchEvents = async () => {
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
            },
          });

          const eventsData = response.data.data || [];

          const eventsWithArtists = await Promise.all(eventsData.map(async (event) => {
            let eventName = event.eventName;
            let artistNames = event.artistList?.map(artist => artist.name).join(', ') || '';

            if (!eventName && artistNames) {
              eventName = artistNames;
            }

            const artistImage = await fetchArtistImage(artistNames, spotifyAccessToken);
            return {
              ...event,
              artistImage,
              name: eventName, // Ensure the name is set correctly
            };
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-lg w-full">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Event</h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading events...</p>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="h-80 overflow-y-auto space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center space-x-4 p-2 border rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(event)}
                >
                  <img
                    src={event.artistImage}
                    alt={event.name}
                    className="w-12 h-12 rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {event.name}
                    </h3>
                    <p className="text-gray-600">{event.venue?.name || 'Unknown Venue'}</p>
                    <p className="text-gray-500">{event.date ? new Date(event.date).toLocaleDateString() : 'Date Unknown'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t">
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
