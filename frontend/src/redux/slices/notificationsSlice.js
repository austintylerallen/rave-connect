import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [], // Initial empty array for notifications
    loading: false,
    error: null,
  },
  reducers: {
    fetchNotificationsStart(state) {
      state.loading = true;
    },
    fetchNotificationsSuccess(state, action) {
      state.loading = false;
      state.notifications = action.payload;
    },
    fetchNotificationsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addNotification(state, action) {
      state.notifications.push(action.payload);
    },
    markNotificationAsRead(state, action) {
      const index = state.notifications.findIndex(notification => notification.id === action.payload);
      if (index !== -1) {
        state.notifications[index].read = true;
      }
    },
  },
});

export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  addNotification,
  markNotificationAsRead,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
