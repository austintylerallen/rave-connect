import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [checkInStatus, setCheckInStatus] = useState('');

  useEffect(() => {
    axios.get(`/api/events/${id}`).then((response) => {
      setEvent(response.data);
    });
  }, [id]);

  const handleCheckIn = () => {
    axios.post(`/api/events/checkin/${id}`)
      .then(response => {
        setCheckInStatus('Check-in successful!');
        setEvent(prevEvent => ({
          ...prevEvent,
          attendees: response.data.attendees
        }));
      })
      .catch(error => {
        setCheckInStatus(error.response.data.msg || 'Check-in failed');
      });
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-purple mb-4">{event.title}</h2>
      <p className="text-darkTeal">{new Date(event.date).toLocaleString()}</p>
      <p className="mt-4 text-gray-600">{event.description}</p>
      <p className="mt-4 text-darkTeal">Location: {event.location}</p>

      {checkInStatus && <p className="mt-4 text-teal">{checkInStatus}</p>}
      
      <button 
        onClick={handleCheckIn} 
        className="mt-6 bg-purple text-white py-2 px-4 rounded hover:bg-darkPurple"
      >
        Check In
      </button>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-darkTeal">Attendees</h3>
        <ul className="list-disc list-inside">
          {event.attendees.map(attendee => (
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
