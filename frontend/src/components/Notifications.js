import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import socket from '../services/socket';
import {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  addNotification,
  markNotificationAsRead,
} from '../redux/slices/notificationsSlice';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import './Notifications.css';

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const loading = useSelector((state) => state.notifications.loading);
  const error = useSelector((state) => state.notifications.error);
  const user = useSelector((state) => state.auth.user);

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

    const userId = user?.user?.id;

    if (userId) {
      console.log(`Joining room for user ID: ${userId}`);
      socket.emit('join', userId);

      socket.on('notification', (notification) => {
        console.log('Notification received from server:', notification);
        dispatch(addNotification(notification));
        // Automatically show toast notification when received
      });
    }

    return () => {
      socket.off('notification'); // Clean up listener
      console.log('Socket listener removed');
    };
  }, [dispatch, user]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
    // Additional logic to handle marking as read on the server could go here
  };

  const renderNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="notification-icon success-icon" />;
      case 'error':
        return <FaTimesCircle className="notification-icon error-icon" />;
      case 'info':
        return <FaInfoCircle className="notification-icon info-icon" />;
      case 'warning':
        return <FaExclamationCircle className="notification-icon warning-icon" />;
      default:
        return <FaInfoCircle className="notification-icon" />;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="notifications-container">
      <h2 className="notifications-header">Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification._id} className={`notification-card ${notification.type}`}>
            <div className="notification-content">
              {renderNotificationIcon(notification.type)}
              <div className="notification-text">
                <p>{notification.message}</p>
                <span className="notification-timestamp">{new Date().toLocaleString()}</span>
              </div>
            </div>
            <button
              className="mark-as-read-button"
              onClick={() => handleMarkAsRead(notification._id)}
            >
              Mark as Read
            </button>
          </div>
        ))
      ) : (
        <p className="no-notifications">No notifications found</p>
      )}
    </div>
  );
};

export default Notifications;
