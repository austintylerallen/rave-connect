import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [checkInStatus, setCheckInStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`https://edmtrain.com/api/events`, {
          params: {
            id,
            client: process.env.REACT_APP_EDM_TRAIN_API_KEY,
          },
        });

        if (response.data && response.data.data && response.data.data.length > 0) {
          setEvent(response.data.data[0]);
        } else {
          setError('Event not found.');
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to fetch event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleRSVP = async () => {
    try {
      const response = await axios.post(`/api/events/rsvp/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRsvpStatus('RSVP successful!');
      setEvent(prevEvent => ({
        ...prevEvent,
        attendees: response.data.attendees
      }));
    } catch (error) {
      setRsvpStatus(error.response.data.msg || 'RSVP failed');
    }
  };

  const handleCheckIn = async () => {
    try {
      const response = await axios.post(`/api/events/checkin/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCheckInStatus('Check-in successful!');
      setEvent(prevEvent => ({
        ...prevEvent,
        attendees: response.data.attendees
      }));
    } catch (error) {
      setCheckInStatus(error.response.data.msg || 'Check-in failed');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>No event details available.</p>;

  return (
    <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-purple mb-4">{event.name || event.artistList.map(artist => artist.name).join(', ')}</h2>
      <p className="text-darkTeal">{new Date(event.date).toLocaleString()}</p>
      <p className="mt-4 text-gray-600">{event.description || 'No description available.'}</p>
      <p className="mt-4 text-darkTeal">Location: {event.venue?.name || 'Unknown Venue'}, {event.venue?.location || 'Unknown Location'}</p>

      {rsvpStatus && <p className="mt-4 text-teal">{rsvpStatus}</p>}
      {checkInStatus && <p className="mt-4 text-teal">{checkInStatus}</p>}
      
      <button 
        onClick={handleRSVP} 
        className="mt-6 bg-purple text-white py-2 px-4 rounded hover:bg-darkPurple"
      >
        RSVP
      </button>

      <button 
        onClick={handleCheckIn} 
        className="mt-6 ml-4 bg-purple text-white py-2 px-4 rounded hover:bg-darkPurple"
      >
        Check In
      </button>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-darkTeal">Attendees</h3>
        <ul className="list-disc list-inside">
          {event.attendees?.map(attendee => (
            <li key={attendee.user._id} className={attendee.checkedIn ? 'text-teal' : 'text-gray-600'}>
              {attendee.user.username} {attendee.checkedIn && '(Checked In)'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventDetail;
