import axios from 'axios';
import { FETCH_NOTIFICATIONS, MARK_NOTIFICATION_AS_READ } from './types';

export const fetchNotifications = () => async dispatch => {
  try {
    const res = await axios.get('/api/notifications');
    dispatch({
      type: FETCH_NOTIFICATIONS,
      payload: res.data,
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
  }
};

export const markNotificationAsRead = (notificationId) => async dispatch => {
  try {
    const res = await axios.put(`/api/notifications/${notificationId}/read`);
    dispatch({
      type: MARK_NOTIFICATION_AS_READ,
      payload: res.data,
    });
  } catch (err) {
    console.error('Error marking notification as read:', err);
  }
};
