import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
} from '../redux/slices/notificationsSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const loading = useSelector((state) => state.notifications.loading);
  const error = useSelector((state) => state.notifications.error);

  useEffect(() => {
    const fetchNotifications = async () => {
      dispatch(fetchNotificationsStart());
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        dispatch(fetchNotificationsSuccess(response.data));
      } catch (err) {
        dispatch(fetchNotificationsFailure(err.message));
      }
    };

    fetchNotifications();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification.id}>{notification.message}</div>
        ))
      ) : (
        <p>No notifications found</p>
      )}
    </div>
  );
};

export default Notifications;
