import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import notificationsReducer from './slices/notificationsSlice'; // Adjust the path if needed

const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
    // Add any other slices here as needed
  },
  // You can add middleware or enhancers if necessary, but Redux Toolkit provides good defaults
});

export default store;
