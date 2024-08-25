import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import notificationsReducer from './slices/notificationsSlice'; // Add this import

const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer, // Add this to the store
  },
});

export default store;
