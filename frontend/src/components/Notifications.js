import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
        const userId = localStorage.getItem('userId'); // Do not parse this if it's already a string
    
        if (!userId) {
            console.error('No user ID found');
            setError('No user ID found');
            return;
        }
    
        try {
            const token = localStorage.getItem('token'); // Get the token
            if (!token) {
                console.error('No token found');
                setError('No token found');
                return;
            }
    
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the header
                },
            });
    
            setNotifications(response.data);
        } catch (err) {
            console.error('Error fetching notifications:', err.message);
            setError('Failed to fetch notifications');
        }
    };
    

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {error && <p className="text-red-500">{error}</p>}
      {/* Render notifications here */}
      {notifications.map((notification, index) => (
        <div key={index}>
          {/* Customize the rendering based on notification type */}
          {notification.type === 'like' && <p>{notification.sender.username} liked your post.</p>}
          {notification.type === 'comment' && <p>{notification.sender.username} commented on your post.</p>}
          {/* Add other types here */}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
